import { FixtureFactory } from '@mikro-resources/fixtures';

import { User } from '../../entities/User';
import { Orm } from '../types/orm';

export const UserFixture = async (orm: Orm): Promise<void> => {
  const factory = new FixtureFactory(orm);
  // factory.make(User).oneAndPersist();

  const adminUser = await factory.make(User).oneAndPersist();
};
