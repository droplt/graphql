import deepEqual from 'deep-equal';
import { pick } from 'ramda';

import { getUuid } from '../../helpers/torrent';
import bt, { NormalizedTorrent } from '../../services/bittorrent';

interface Torrent extends NormalizedTorrent {
  uuid: string;
}

interface Feed {
  [id: string]: Record<string, Partial<Torrent>>;
}

const PROPS_TO_SAVE: Array<keyof Torrent> = [
  'uuid',
  'id',
  'name',
  'totalSize',
  'state',
  'progress'
];

export default class Handler {
  private currFeed: Feed = {};

  public async run(): Promise<void> {
    // fetch data from provider
    const { torrents } = await bt.getAllData();

    // build next feed
    const nextFeed = this.formatFeed(torrents);

    // build diff with current feed
    const feedDiff = this.feedDiff(nextFeed);

    // build diff to be applied to database
    const updates = this.formatUpdates(feedDiff);

    if (updates.length !== 0) {
      console.log('to save');
      console.log(updates);
    }

    // // check if there is any diff
    // if (Object.keys(feedDiff).length > 0) {
    //   // prepare diff to be applied to database
    //   console.log(feedDiff);
    // }

    this.currFeed = nextFeed;
  }

  public onError(err: Error): void {
    console.log('Oops', err);
  }

  private feedDiff(nextFeed: Feed): Feed {
    const { currFeed } = this;

    let newItemCount = 0;

    const diff = Object.keys(nextFeed).reduce((acc, uuid) => {
      const currFeedItem = currFeed[uuid];
      const nextFeedItem = nextFeed[uuid];

      // uuid doesn't exists: it's a brand new item, so every detail is part of the diff
      if (typeof currFeedItem === 'undefined') {
        // add whole item to diff
        acc[uuid] = nextFeedItem;
        newItemCount += 1;
        return acc;
      }

      // uuid exists: compute props differences
      Object.keys(nextFeedItem).forEach((propKey) => {
        // if one of the prop is inequal, we need to add it to the diff
        if (!deepEqual(currFeedItem[propKey], nextFeedItem[propKey])) {
          // initialize uuid diff when this is the first known inequal prop
          if (typeof acc[uuid] === 'undefined') {
            acc[uuid] = {};
          }
          // add prop to diff
          acc[uuid][propKey] = nextFeedItem[propKey];
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
      Object.keys(this.currFeed).forEach((uuid) => {
        if (typeof nextFeed[uuid] === 'undefined') {
          // soft delete item from database
          console.log('DELETE', uuid);
        }
      });
    }
  }

  private formatFeed(torrents: NormalizedTorrent[]): Feed {
    // We need to calculate a uniq id for each torrent because of transmission service.
    // After a service restart, all torrents ids are re-assigned randomly.
    // So we can't use them as consitent identifiers.
    return (
      torrents
        .map((t) => ({
          uuid: getUuid(t),
          tid: t.id,
          ...t
        }))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({ id, ...t }) => t)
        .reduce(
          (acc, torrent) => ({
            ...acc,
            [torrent.uuid]: torrent
          }),
          {}
        )
    );
  }

  private formatUpdates(feed: Feed): Array<Partial<Torrent>> {
    // We need to filter the torrent properties we want to save to database.
    // To ease this process we add torrent uuit to.
    return Object.keys(feed)
      .filter(
        (uuid) => Object.keys(pick(PROPS_TO_SAVE, feed[uuid])).length !== 0
      )
      .map((uuid) => ({
        uuid,
        ...pick(PROPS_TO_SAVE, feed[uuid])
      }));
  }
}
