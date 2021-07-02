import {
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';
import { v4 } from 'uuid';

import { Base } from './Base';
import { TorrentFile } from './TorrentFile';
import { User } from './User';

@Entity()
@ObjectType('Torrent')
export class Torrent extends Base {
  @PrimaryKey()
  @Field(() => ID)
  id: string = v4();

  @Field()
  @Property()
  name?: string;

  @Field(() => User)
  @ManyToOne(() => User)
  user!: User;

  @Field(() => [TorrentFile])
  @OneToMany(() => TorrentFile, (file) => file.torrent)
  files?: TorrentFile[];
}
