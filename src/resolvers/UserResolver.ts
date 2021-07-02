import { Query, Resolver } from 'type-graphql';

import { User } from '../entities/User';
import { Em } from '../utils/decorators/em';

@Resolver(() => User)
export class UserResolver {
  @Query(() => [User])
  async users(@Em() { usersRepository }: Em): Promise<User[]> {
    return usersRepository.findAll();
  }
}
