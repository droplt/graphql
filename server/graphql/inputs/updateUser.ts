import { Field, InputType } from 'type-graphql';

import { UserModel } from '../../entities';

@InputType()
export class UpdateUserInput implements Partial<UserModel> {
  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  photoURL?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  isDisabled?: boolean;
}
