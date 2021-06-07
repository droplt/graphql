import 'dotenv/config';
import 'reflect-metadata';
import './services/fireorm';
import './services/transmission';

import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import path from 'path';
import * as TypeGraphQL from 'type-graphql';

import { TorrentResolver, UserResolver } from './graphql';
import { authentication, authorization } from './middlewares';
import { Context } from './types';

const { PORT = 1338 } = process.env;

(async () => {
  /**
   * ApolloServer configuration
   */
  const server = new ApolloServer({
    schema: await TypeGraphQL.buildSchema({
      resolvers: [UserResolver, TorrentResolver],
      emitSchemaFile: 'public/schema.graphql',
      authChecker: authorization
    }),
    context: async ({ req }: { req: express.Request }): Promise<Context> => ({
      user: req.user
    }),
    playground: {
      settings: {
        'request.credentials': 'include'
      }
    }
  });

  /**
   * Express app configuration
   */
  const app = express();
  app.use(express.static(path.resolve('public')));
  app.use(express.json() as express.RequestHandler);
  app.use(authentication());

  /**
   * Connect ApolloServer to Express
   */
  server.applyMiddleware({ app, path: '/graphql' });

  /**
   * Start Express server
   */
  app.listen(PORT, () => {
    console.log(`🔥 graphql -> http://localhost:${PORT}/graphql`);
  });
})();
