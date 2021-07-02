import { registerEnumType } from 'type-graphql';

import { UserRole } from './user-role';

registerEnumType(UserRole, {
  name: 'UserRole'
});
