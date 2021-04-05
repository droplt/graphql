import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { BaseModel, TorrentInterface, TorrentModel } from '.';

export interface FileInterface {
  id: string;
  name: string;
  size: number;
  sizeCompleted: number;
  torrent?: TorrentInterface;
}

@Entity()
@ObjectType()
export class FileModel extends BaseModel implements FileInterface {
  @Field(() => ID)
  @PrimaryColumn()
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => Number)
  @Column()
  size: number;

  @Field(() => Number)
  @Column()
  sizeCompleted: number;

  @ManyToOne(() => TorrentModel, (torrent) => torrent.files)
  torrent: TorrentInterface;
}
