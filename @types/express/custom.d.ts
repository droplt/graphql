import * as admin from 'firebase-admin';

declare module 'express' {
  export interface Request {
    token?: string;
    user?: admin.auth.UserRecord;
  }
}
