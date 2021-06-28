import {
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
  Unique
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';
import { v4 } from 'uuid';

import { Torrent } from '.';
import { BaseEntity } from './BaseEntity';

@ObjectType('User')
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryKey()
  id: string = v4();

  @Field()
  @Property()
  @Unique()
  username!: string;

  @Field()
  @Property()
  @Unique()
  email!: string;

  @Field()
  @Property()
  password!: string;

  @Field(() => UserRole)
  @Enum(() => UserRole)
  role!: UserRole;

  @Field(() => [Torrent])
  @OneToMany(() => Torrent, (torrent) => torrent.user, { nullable: true })
  torrents?: Torrent[];
}

export enum UserRole {
  ADMIN = 'admin',
  CONTRIBUTOR = 'contributor',
  VISITOR = 'visitor'
}
