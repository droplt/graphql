import cookies from 'cookie-parser';
import { NextFunction, Request, Response, Router } from 'express';
import bearer from 'express-bearer-token';

import { AUTH_COOKIE, AUTH_EXPIRES } from '../constants';
import admin from '../services/firebase';

// Verify session cookie
// - populate req.user with signed-in user
// - try to refresh session cookie if request has a token
const checkSessionCookie =
  () => async (req: Request, res: Response, next: NextFunction) => {
    const { token = '', cookies } = req;
    const { access_token } = cookies;

    try {
      const { uid } = await admin
        .auth()
        .verifySessionCookie(access_token, true);
      const user = await admin.auth().getUser(uid);
      req.user = user;
    } catch (e) {
      // Request has a token, should proceed to the next middleware to refresh
      // the authentication token cookie
      if (token) {
        return next();
      }
      return res.clearCookie(AUTH_COOKIE).status(401).send();
    }

    next();
  };

// Create session cookie
// - verify access token
// - attach session cookie to response
const refreshSessionCookie =
  () => async (req: Request, res: Response, next: NextFunction) => {
    const { token = '' } = req;

    if (!token) {
      return next();
    }

    try {
      const decoded = await admin.auth().verifyIdToken(token);

      if (!(new Date().getTime() / 1000 - decoded.auth_time < 5 * 60)) {
        return res.status(401).send('Recent sign in required!');
      }

      const sessionCookie = await admin
        .auth()
        .createSessionCookie(token, { expiresIn: AUTH_EXPIRES });
      res.cookie(AUTH_COOKIE, sessionCookie, {
        maxAge: AUTH_EXPIRES,
        httpOnly: true,
        secure: true
      });
      return next();
    } catch (e) {
      return res.status(401).send();
    }
  };

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const authentication = () =>
  Router()
    .use(cookies())
    .use(bearer())
    .use(checkSessionCookie())
    .use(refreshSessionCookie())
    .get('/api/auth', (req, res) => res.end())
    .post('/api/auth', (req, res) => res.end())
    .delete('/api/auth', (req, res) => res.clearCookie(AUTH_COOKIE).end());
