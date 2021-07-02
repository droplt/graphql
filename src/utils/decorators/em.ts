import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { createParamDecorator } from 'type-graphql';

import { Torrent } from '../../entities/Torrent';
import { User } from '../../entities/User';
import { Context } from '../interfaces/context';

export const Em = (): ParameterDecorator => {
  return createParamDecorator<Context>(
    ({ context: { em } }): Em => ({
      em,
      usersRepository: em.getRepository(User),
      torrentsRepository: em.getRepository(Torrent)
    })
  );
};

export type Em = {
  em: EntityManager;
  usersRepository: EntityRepository<User>;
  torrentsRepository: EntityRepository<Torrent>;
};
