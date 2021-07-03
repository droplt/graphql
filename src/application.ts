import './utils/enums/graphql';

import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import express, { Express } from 'express';
import path from 'path';
import * as TypeGraphQL from 'type-graphql';

import { TorrentResolver } from './resolvers/TorrentResolver';
import { UserResolver } from './resolvers/UserResolver';
import config from './utils/config/mikro-orm.config';
import { Context } from './utils/interfaces/context';

const { PORT = 1338 } = process.env;

export default class Application {
  public orm: MikroORM<IDatabaseDriver<Connection>>;
  public server: ApolloServer;
  public app: Express;

  /**
   * Bootstrap application
   * - connect & migrate to database
   * - instanciate GraphQL server
   */
  public bootstrap = async (): Promise<void> => {
    /**
     * Express server
     */
    this.app = express();

    /**
     * Database connection
     */
    try {
      this.orm = await MikroORM.init(config);
    } catch (error) {
      console.error('📌 Could not connect to the database', error);
      throw Error(error);
    }

    /**
     * GraphQL server
     */
    try {
      this.server = new ApolloServer({
        schema: await TypeGraphQL.buildSchema({
          resolvers: [UserResolver, TorrentResolver],
          emitSchemaFile: 'public/schema.graphql'
        }),
        context: ({ req, res }): Context => ({
          em: this.orm.em.fork(),
          req,
          res
        })
      });
    } catch (error) {
      console.error('📌 Could not instantiate apollo server', error);
      throw Error(error);
    }
  };

  /**
   * Run application
   */
  public run = async (): Promise<void> => {
    // Connect ApolloServer to Express
    this.server.applyMiddleware({ app: this.app, path: '/graphql' });

    // Serve public files (GraphQL schema …)
    this.app.use(express.static(path.resolve('public')));

    // Add support for JSON requests
    this.app.use(express.json() as express.RequestHandler);

    /**
     * Start Express server
     */
    this.app.listen(PORT, () => {
      console.log(`🚀 http://localhost:${PORT}/graphql`);
    });
  };
}
