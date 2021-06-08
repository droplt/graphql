import { Field, ID, ObjectType } from 'type-graphql';

import { UserRole } from '../types';

@ObjectType('User')
export class User {
  @Field(() => ID)
  uid: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  username: string;

  @Field()
  photoURL: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field()
  isAdmin: boolean;

  @Field()
  isContributor: boolean;

  @Field()
  isVisitor: boolean;

  @Field()
  isVerified: boolean;

  @Field()
  isDisabled: boolean;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  connectedAt?: Date;
}
