import { ApolloServer } from 'apollo-server';
import { GraphQLSchema } from 'graphql';
import * as TypeGraphQL from 'type-graphql';
import * as TypeORM from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';

import { FileModel, TorrentModel } from './entities';
import { TorrentResolver } from './resolvers';
import { TransmissionJob, TransmissionService } from './services';

TypeORM.useContainer(Container);

export class Application {
  public schema: GraphQLSchema;

  public connect = async (): Promise<void> => {
    // TypeORM connection
    const connectionOptions = await TypeORM.getConnectionOptions();
    await TypeORM.createConnection({
      ...connectionOptions,
      entities: [TorrentModel, FileModel]
    });

    // TypeGraphQL configuration
    this.schema = await TypeGraphQL.buildSchema({
      resolvers: [TorrentResolver],
      container: Container
    });

    // Transmission Service
    Container.get(TransmissionService).connect();
    Container.get(TransmissionJob).start();
  };

  public init = async (): Promise<void> => {
    const server = new ApolloServer({ schema: this.schema });
    server.listen(process.env.PORT || 4000).then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`);
    });
  };
}
