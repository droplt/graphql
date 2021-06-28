import { Query, Resolver } from 'type-graphql';

import { User } from '../entities';

@Resolver(() => User)
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    return [];
  }
}
