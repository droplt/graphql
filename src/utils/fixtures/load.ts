import { Orm } from '../types/orm';
import { UserFixture } from './user';

const { NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';

export const loadFixtures = (orm: Orm): Promise<void[]> => {
  // if (isDev) {
  //   return Promise.all([UserFixture(orm)]);
  // }

  return Promise.all([]);
};
