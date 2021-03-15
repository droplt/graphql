import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { BaseModel, FileInterface, FileModel } from '.';

export interface TorrentInterface {
  hash: string;
  id: number;
  name: string;
  size: number;
  status: number;
  error: number;
  errorString: string;
  files?: FileInterface[];
}

@Entity()
@ObjectType()
export class TorrentModel extends BaseModel implements TorrentInterface {
  @Field(() => ID)
  @PrimaryColumn()
  hash: string;

  @Field(() => Number)
  @Column()
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => Number)
  @Column()
  size: number;

  @Field(() => TorrentStatus)
  @Column()
  status: number;

  @Field(() => Number)
  @Column()
  error: number;

  @Field(() => String)
  @Column()
  errorString: string;

  @Field(() => [FileModel])
  @OneToMany(() => FileModel, (file) => file.torrent, {
    cascade: true,
    eager: true
  })
  files: FileInterface[];
}

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
