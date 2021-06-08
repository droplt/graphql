import express from 'express';

import { Context } from '../types';

export const context = async ({
  req
}: {
  req: express.Request;
}): Promise<Context> => ({
  user: req.user
});
