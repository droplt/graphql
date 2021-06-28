import { registerEnumType } from 'type-graphql';

import { UserRole } from '../entities';

registerEnumType(UserRole, {
  name: 'UserRole'
});
