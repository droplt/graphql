import deepEqual from 'deep-equal';

import { getUuid } from '../../helpers/torrent';
import bt, { NormalizedTorrent } from '../../services/bittorrent';

interface Torrent extends NormalizedTorrent {
  uuid: string;
}

interface Feed {
  [id: string]: Record<string, Torrent>;
}

export default class Handler {
  private currFeed: Feed = {};

  public async run(): Promise<void> {
    // fetch data from provider
    const { torrents } = await bt.getAllData();

    // build next feed
    const nextFeed = this.formatFeed(torrents);

    // build diff with current feed
    const feedDiff = this.feedDiff(nextFeed);

    // check if there is any diff
    if (Object.keys(feedDiff).length > 0) {
      // save diff to database
      console.log(feedDiff);
    }

    this.currFeed = nextFeed;
  }

  public onError(err: Error): void {
    console.log('Oops', err);
  }

  private feedDiff(nextFeed: Feed): Feed {
    const { currFeed } = this;

    let newItemCount = 0;

    const diff = Object.keys(nextFeed).reduce((acc, hash) => {
      const currFeedItem = currFeed[hash];
      const nextFeedItem = nextFeed[hash];

      // hash doesn't exists in currFeed
      // it's a brand new item, so every detail is part of the diff
      if (typeof currFeedItem === 'undefined') {
        // add whole item to diff
        acc[hash] = nextFeedItem;
        newItemCount += 1;
        return acc;
      }

      // hash exists
      // compute props differences
      Object.keys(nextFeedItem).forEach((propKey) => {
        // if one of the prop is inequal, we need to add it to the diff
        if (!deepEqual(currFeedItem[propKey], nextFeedItem[propKey])) {
          // initialize hash diff when this is the first known inequal prop
          if (typeof acc[hash] === 'undefined') {
            acc[hash] = {};
          }
          // add prop to diff
          acc[hash][propKey] = nextFeedItem[propKey];
        }
      });

      return acc;
    }, {} as Feed);

    // try to detect deleted torrents
    this.handleDeletedItems(nextFeed, newItemCount);

    return diff;
  }

  private handleDeletedItems(nextFeed: Feed, newItemCount: number) {
    // we need to look for deleted items in two scenarios:
    // 1. the next feed length is less than the current feed length
    // 2. at least one new item was added and the next feed length is
    //    equal to or greater than the current feed length
    //
    // we definitely don't need to look for deleted items if the number
    // of new items is equal to the difference between next feed list
    // length and previous feed list length
    const nextFeedLength = Object.keys(nextFeed).length;
    const currFeedLength = Object.keys(this.currFeed).length;

    // check if the next feed has less items than the current feed
    let shouldLook = nextFeedLength < currFeedLength;

    if (newItemCount > 0) {
      if (nextFeedLength >= currFeedLength) shouldLook = true;
      if (newItemCount === nextFeedLength - currFeedLength) shouldLook = false;
    }

    if (shouldLook) {
      Object.keys(this.currFeed).forEach((hash) => {
        if (typeof nextFeed[hash] === 'undefined') {
          // soft delete item from database
          console.log('DELETE', hash);
        }
      });
    }
  }

  private formatFeed(torrents: NormalizedTorrent[]): Feed {
    return torrents
      .map((t) => ({
        uuid: getUuid(t),
        ...t
      }))
      .reduce(
        (acc, torrent) => ({
          ...acc,
          [torrent.id]: torrent
        }),
        {}
      );
  }
}
