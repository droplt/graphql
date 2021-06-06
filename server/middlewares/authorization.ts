import { AuthChecker } from 'type-graphql';

import { getUserRoles } from '../helpers/user';
import { Context, UserRole } from '../types';

export const authorization: AuthChecker<Context, UserRole> = (
  { context },
  requiredRoles
) => {
  // Retrieve user roles from customClaims
  const userRoles = getUserRoles(context.user);

  // Check user has every roles required
  return requiredRoles.every((required) => userRoles.includes(required));
};
