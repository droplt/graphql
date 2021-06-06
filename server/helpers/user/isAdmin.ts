import admin from '../../services/firebase';

const isAdmin = (user: admin.auth.UserRecord): boolean => {
  return user.customClaims?.admin || false;
};

export default isAdmin;
