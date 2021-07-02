import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';
import { v4 } from 'uuid';

import { Base } from './Base';
import { Torrent } from './Torrent';

@Entity()
@ObjectType('TorrentFile')
export class TorrentFile extends Base {
  @PrimaryKey()
  @Field(() => ID)
  id: string = v4();

  @Field(() => Torrent)
  @ManyToOne(() => Torrent)
  torrent!: Torrent;
}
