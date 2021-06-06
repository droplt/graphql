import * as admin from 'firebase-admin';
import { registerEnumType } from 'type-graphql';

export type AuthUser = admin.auth.UserRecord;

export interface Context {
  user?: AuthUser;
}

export enum UserRole {
  ADMIN = 'admin',
  CONTRIBUTOR = 'contributor',
  VISITOR = 'visitor'
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User role'
});
