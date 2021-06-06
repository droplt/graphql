import admin from '../../services/firebase';

const isContributor = (user: admin.auth.UserRecord): boolean => {
  return user.customClaims?.contributor || false;
};

export default isContributor;
