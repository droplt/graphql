import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { auth, OpenidRequest, requiresAuth } from 'express-openid-connect';
import * as TypeGraphQL from 'type-graphql';
import * as TypeORM from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';

import { FileModel, TorrentModel } from './entities';
import { TorrentResolver } from './graphql';
import { TransmissionJob, TransmissionService } from './services';

const PORT = process.env.PORT || 4000;
const PATH = '/graphql';

export class Server {
  /**
   * Bootstrap server
   * - connect to database
   * - connect to external services
   * - start jobs
   */
  public async bootstrap(): Promise<void> {
    // ORM dependency injection
    TypeORM.useContainer(Container);

    // Database connection
    await TypeORM.createConnection({
      type: 'better-sqlite3',
      database: './database/sqlite.db',
      synchronize: true,
      entities: [TorrentModel, FileModel]
    });

    // Connect to Transmission instance
    Container.get(TransmissionService).connect();

    // Start Transmission job
    Container.get(TransmissionJob).start();
  }

  /**
   * Start server
   * - start Apollo server
   * - start Express server
   */
  public async start(): Promise<void> {
    // HTTP server configuration
    const app = express();

    // Auth0 authentication
    app.use(
      auth({
        issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
        baseURL: process.env.BASE_URL,
        clientID: process.env.AUTH0_CLIENT_ID,
        secret: process.env.SESSION_SECRET,
        authRequired: false,
        auth0Logout: true
      })
    );

    // Mount login page
    app.get('/', requiresAuth(), (req, res) => {
      console.log(req.oidc?.idToken);
      res.redirect(PATH);
    });

    app.get('/graphql', requiresAuth());

    // Build the GraphQL schema
    const schema = await TypeGraphQL.buildSchema({
      resolvers: [TorrentResolver],
      container: Container
    });

    // Create the GraphQL server
    const server = new ApolloServer({
      schema,
      context: ({ req }: { req: OpenidRequest }) => {
        // console.log(req.oidc?.user);
        return {
          req
          // user: req.openId?.oidc.user
        };
      }
    });

    // Apply the GraphQL server middleware
    server.applyMiddleware({ app, path: PATH });

    // Launch the HTTP server
    app.listen({ port: PORT }, () =>
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      )
    );
  }
}
