import 'dotenv/config';
import 'reflect-metadata';

import { ApolloServer } from 'apollo-server';
import * as TypeGraphQL from 'type-graphql';
import * as TypeORM from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';

import { FileModel, TorrentModel } from './entities';
import { TorrentResolver } from './resolvers';
import { TransmissionJob, TransmissionService } from './services';

TypeORM.useContainer(Container);

(async () => {
  // TypeORM connection
  await TypeORM.createConnection({
    type: 'better-sqlite3',
    database: './database/sqlite.db',
    synchronize: true,
    entities: [TorrentModel, FileModel]
  });

  // TypeGraphQL configuration
  const schema = await TypeGraphQL.buildSchema({
    resolvers: [TorrentResolver],
    container: Container
  });

  // Transmission Service
  Container.get(TransmissionService).connect();
  Container.get(TransmissionJob).start();

  const server = new ApolloServer({ schema });
  server.listen(process.env.PORT || 4000).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
