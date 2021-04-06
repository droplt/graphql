import { Stream } from 'stream';
import { registerEnumType } from 'type-graphql';

export interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: Stream;
}

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

registerEnumType(OrderDirection, {
  name: 'OrderDirection',
  valuesConfig: {
    ASC: {
      description: 'Ascending direction'
    },
    DESC: {
      description: 'Descending direction'
    }
  }
});

export enum TorrentStatus {
  STOPPED = 0,
  CHECK_WAIT = 1,
  CHECK = 2,
  DOWNLOAD_WAIT = 3,
  DOWNLOAD = 4,
  SEED_WAIT = 5,
  SEED = 6,
  ISOLATED = 7
}

registerEnumType(TorrentStatus, {
  name: 'TorrentStatus',
  valuesConfig: {
    STOPPED: {
      description: 'Torrent is stopped'
    },
    CHECK_WAIT: {
      description: 'Queued to check files'
    },
    CHECK: {
      description: 'Checking files'
    },
    DOWNLOAD_WAIT: {
      description: 'Queued to download'
    },
    DOWNLOAD: {
      description: 'Downloading'
    },
    SEED_WAIT: {
      description: 'Queued to seed'
    },
    SEED: {
      description: 'Seeding'
    },
    ISOLATED: {
      description: "Torrent can't find peers"
    }
  }
});
