import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { TorrentStatus } from '../types';
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
