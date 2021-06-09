// import deepEqual from 'deep-equal';
// import Schedule from 'node-schedule';
// import TransmissionPromise from 'transmission-promise';
// import { Inject, Service } from 'typedi';
// import { EntityManager, Repository } from 'typeorm';
// import { InjectManager } from 'typeorm-typedi-extensions';

// import { TorrentInterface, TorrentModel } from '../entities';

// /*********
//  * TYPES *
//  *********/
// interface ConnectionOptions {
//   host: string;
//   port: string;
//   username: string;
//   password: string;
// }

// interface TransmissionTorrent {
//   hashString: string;
//   id: number;
//   name: string;
//   status: number;
//   totalSize: number;
//   error: number;
//   errorString: string;
//   files: TransmissionFile[];
// }

// interface TransmissionFile {
//   name: string;
//   length: number;
//   bytesCompleted: number;
// }

// const TORRENT_PROPS = [
//   'hashString',
//   'id',
//   'name',
//   'status',
//   'error',
//   'errorString',
//   'totalSize',
//   'files'
// ];

// /***********
//  * SERVICE *
//  ***********/
// @Service({
//   factory: function () {
//     return new TransmissionService({
//       host: process.env.TRANSMISSION_HOST ?? '',
//       port: process.env.TRANSMISSION_PORT ?? '',
//       username: process.env.TRANSMISSION_USER ?? '',
//       password: process.env.TRANSMISSION_PASS ?? ''
//     });
//   }
// })
// export class TransmissionService {
//   private connection: TransmissionPromise;

//   constructor(private connectionOptions: ConnectionOptions) {}

//   public connect(): void {
//     this.connection = new TransmissionPromise(this.connectionOptions);
//   }

//   public async get(id: number): Promise<TorrentInterface | null> {
//     const { torrents } = await this.connection.get(id, TORRENT_PROPS);
//     return torrents.map(this.transform)[0] || null;
//   }

//   public async all(): Promise<TorrentInterface[] | []> {
//     const { torrents } = await this.connection.get(null, TORRENT_PROPS);
//     return torrents.map(this.transform);
//   }

//   private transform(torrent: TransmissionTorrent): TorrentInterface {
//     const { hashString, totalSize, files, ...rest } = torrent;
//     return {
//       hash: hashString,
//       size: totalSize,
//       files: files.map(({ length, bytesCompleted, ...fileRest }, i) => ({
//         // calculate a dynamic id for each files
//         id: `${hashString}-${i}`,
//         size: length,
//         sizeCompleted: bytesCompleted,
//         ...fileRest
//       })),
//       ...rest
//     };
//   }
// }

// /********
//  * JOBS *
//  ********/
// interface Feed {
//   [hash: string]: Record<string, TorrentInterface>;
// }

// @Service()
// export class TransmissionJob {
//   @InjectManager()
//   private manager: EntityManager;

//   @Inject()
//   private service: TransmissionService;

//   private currFeed: Feed = {};

//   get torrentRepo(): Repository<TorrentModel> {
//     return this.manager.getRepository(TorrentModel);
//   }

//   public start(): void {
//     Schedule.scheduleJob('*/5 * * * * *', () => this.run());
//   }

//   private async run(): Promise<void> {
//     // build next feed
//     const nextFeed = this.formatFeed(await this.service.all());

//     // build diff with current feed
//     const feedDiff = this.feedDiff(nextFeed);

//     // check if there is any diff
//     if (Object.keys(feedDiff).length > 0) {
//       // save diff to database
//       await this.torrentRepo.save(
//         Object.keys(feedDiff).map((hash) => ({
//           ...feedDiff[hash],
//           hash
//         }))
//       );
//     }

//     // replace current feed with next one
//     this.currFeed = nextFeed;
//   }

//   private feedDiff(nextFeed: Feed): Feed {
//     const { currFeed } = this;

//     let newItemCount = 0;

//     const diff = Object.keys(nextFeed).reduce((acc, hash) => {
//       const currFeedItem = currFeed[hash];
//       const nextFeedItem = nextFeed[hash];

//       // hash doesn't exists in currFeed
//       // it's a brand new item, so every detail is part of the diff
//       if (typeof currFeedItem === 'undefined') {
//         // add whole item to diff
//         acc[hash] = nextFeedItem;
//         newItemCount += 1;
//         return acc;
//       }

//       // hash exists
//       // compute props differences
//       Object.keys(nextFeedItem).forEach((propKey) => {
//         // if one of the prop is inequal, we need to add it to the diff
//         if (!deepEqual(currFeedItem[propKey], nextFeedItem[propKey])) {
//           // initialize hash diff when this is the first known inequal prop
//           if (typeof acc[hash] === 'undefined') {
//             acc[hash] = {};
//           }
//           // add prop to diff
//           acc[hash][propKey] = nextFeedItem[propKey];
//         }
//       });

//       return acc;
//     }, {} as Feed);

//     // try to detect deleted torrents
//     this.handleDeletedItems(nextFeed, newItemCount);

//     return diff;
//   }

//   private handleDeletedItems(nextFeed: Feed, newItemCount: number) {
//     // we need to look for deleted items in two scenarios:
//     // 1. the next feed length is less than the current feed length
//     // 2. at least one new item was added and the next feed length is
//     //    equal to or greater than the current feed length
//     //
//     // we definitely don't need to look for deleted items if the number
//     // of new items is equal to the difference between next feed list
//     // length and previous feed list length
//     const nextFeedLength = Object.keys(nextFeed).length;
//     const currFeedLength = Object.keys(this.currFeed).length;

//     // check if the next feed has less items than the current feed
//     let shouldLook = nextFeedLength < currFeedLength;

//     if (newItemCount > 0) {
//       if (nextFeedLength >= currFeedLength) shouldLook = true;
//       if (newItemCount === nextFeedLength - currFeedLength) shouldLook = false;
//     }

//     if (shouldLook) {
//       Object.keys(this.currFeed).forEach((hash) => {
//         if (typeof nextFeed[hash] === 'undefined') {
//           // soft delete item from database
//           this.torrentRepo.delete(hash);
//         }
//       });
//     }
//   }

//   private formatFeed(torrents: TorrentInterface[]): Feed {
//     return torrents.reduce(
//       (acc, torrent) => ({
//         ...acc,
//         [torrent.hash]: torrent
//       }),
//       {}
//     );
//   }
// }
