import { Field, InputType } from 'type-graphql';

import { User } from '../../entities/user';

@InputType()
export class UpdateMeInput implements Partial<User> {
  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  photoURL?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;
}
