import { createParamDecorator } from 'type-graphql';

import { Context } from '../../types';
export { AuthUser as AuthUserType } from '../../types';

export const AuthUser = () => {
  return createParamDecorator<Context>(({ context }) => context.user);
};
