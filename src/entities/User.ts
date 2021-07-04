import {
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
  Unique
} from '@mikro-orm/core';
import { Fixture } from '@mikro-resources/fixtures';
import { Field, ID, ObjectType } from 'type-graphql';
import { v4 } from 'uuid';

import { UserRole } from '../utils/enums/user-role';
import { Base } from './Base';
import { Torrent } from './Torrent';

@ObjectType('User')
@Entity()
export class User extends Base {
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

  @Property({ hidden: true })
  password!: string;

  @Field(() => UserRole)
  @Enum(() => UserRole)
  role!: UserRole;

  @Fixture({ ignore: true })
  @Field(() => [Torrent])
  @OneToMany(() => Torrent, (torrent) => torrent.user, { nullable: true })
  torrents?: Torrent[];
}
