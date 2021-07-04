import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';

export type Orm = MikroORM<IDatabaseDriver<Connection>>;
