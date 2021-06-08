import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';

import { User } from '../../entities/user';
import { toUpdateRequest, toUser } from '../../helpers/user';
import admin from '../../services/firebase';
import { UserRole } from '../../types';
import { AuthUser, AuthUserType } from '../decorators';
import { UpdateMeInput, UpdateUserInput } from '../inputs';

@Resolver(() => User)
export class UserResolver {
  @Query(() => User)
  async me(@AuthUser() authUser: AuthUserType): Promise<User> {
    const user = await admin.auth().getUser(authUser.uid);
    return toUser(user);
  }

  @Query(() => User)
  async user(@Arg('uid') uid: string): Promise<User> {
    const user = await admin.auth().getUser(uid);
    return toUser(user);
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    const list = await admin.auth().listUsers(1000);
    return list.users.map((user) => toUser(user));
  }

  @Mutation(() => User)
  async updateMe(
    @AuthUser() authUser: AuthUserType,
    @Arg('data') updates: UpdateMeInput
  ): Promise<User> {
    const user = await admin
      .auth()
      .updateUser(authUser.uid, toUpdateRequest(updates));
    return toUser(user);
  }

  @Authorized(UserRole.ADMIN)
  @Mutation(() => User)
  async updateUser(
    @Arg('uid') uid: string,
    @Arg('data') updates: UpdateUserInput
  ): Promise<User> {
    const user = await admin.auth().updateUser(uid, toUpdateRequest(updates));
    return toUser(user);
  }
}
