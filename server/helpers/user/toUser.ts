import { User } from '../../entities/user';
import admin from '../../services/firebase';
import { UserRole } from '../../types';

const toUser = (firebaseUser: admin.auth.UserRecord): User => {
  const {
    uid,
    email,
    metadata,
    phoneNumber,
    customClaims,
    emailVerified,
    disabled,
    photoURL = '',
    displayName = ''
  } = firebaseUser;
  const { creationTime, lastSignInTime } = metadata;
  const { admin = false, contributor = false } = customClaims || {};

  const role = admin
    ? UserRole.ADMIN
    : contributor
    ? UserRole.CONTRIBUTOR
    : UserRole.VISITOR;

  return {
    uid,
    email,
    phone: phoneNumber,
    isDisabled: disabled,
    username: displayName,
    role,
    photoURL,
    isVerified: emailVerified,
    isAdmin: role === UserRole.ADMIN,
    isContributor: role === UserRole.CONTRIBUTOR,
    isVisitor: role === UserRole.VISITOR,
    createdAt: new Date(creationTime),
    connectedAt: lastSignInTime ? new Date(lastSignInTime) : undefined
  };
};

export default toUser;
