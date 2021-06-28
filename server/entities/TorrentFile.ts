import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';
import { v4 } from 'uuid';

import { Torrent } from '.';
import { BaseEntity } from './BaseEntity';

@Entity()
@ObjectType('TorrentFile')
export class TorrentFile extends BaseEntity {
  @PrimaryKey()
  @Field(() => ID)
  id: string = v4();

  @Field(() => Torrent)
  @ManyToOne(() => Torrent)
  torrent!: Torrent;
}
