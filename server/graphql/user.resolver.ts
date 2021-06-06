import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';

import { UserModel } from '../entities';
import { toUpdateRequest, toUserModel } from '../helpers/user';
import admin from '../services/firebase';
import { UserRole } from '../types';
import { AuthUser, AuthUserType } from './decorators';
import { UpdateMeInput, UpdateUserInput } from './inputs';

@Resolver(() => UserModel)
export class UserResolver {
  @Query(() => UserModel)
  async me(@AuthUser() authUser: AuthUserType): Promise<UserModel> {
    const user = await admin.auth().getUser(authUser.uid);
    return toUserModel(user);
  }

  @Query(() => UserModel)
  async user(@Arg('uid') uid: string): Promise<UserModel> {
    const user = await admin.auth().getUser(uid);
    return toUserModel(user);
  }

  @Query(() => [UserModel])
  async users(): Promise<UserModel[]> {
    const list = await admin.auth().listUsers(1000);
    return list.users.map((user) => toUserModel(user));
  }

  @Mutation(() => UserModel)
  async updateMe(
    @AuthUser() authUser: AuthUserType,
    @Arg('data') updates: UpdateMeInput
  ): Promise<UserModel> {
    const user = await admin
      .auth()
      .updateUser(authUser.uid, toUpdateRequest(updates));
    return toUserModel(user);
  }

  @Authorized(UserRole.ADMIN)
  @Mutation(() => UserModel)
  async updateUser(
    @Arg('uid') uid: string,
    @Arg('data') updates: UpdateUserInput
  ): Promise<UserModel> {
    const user = await admin.auth().updateUser(uid, toUpdateRequest(updates));
    return toUserModel(user);
  }
}
