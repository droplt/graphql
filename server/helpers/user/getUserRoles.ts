import { AuthUser, UserRole } from '../../types';

const getUserRoles = (user?: AuthUser) => {
  const { admin = false, contributor = false } = user?.customClaims || {};

  if (admin) {
    return [UserRole.ADMIN, UserRole.CONTRIBUTOR, UserRole.VISITOR];
  }

  if (contributor) {
    return [UserRole.CONTRIBUTOR, UserRole.VISITOR];
  }

  return [UserRole.VISITOR];
};

export default getUserRoles;
