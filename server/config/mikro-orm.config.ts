import { Options } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

import { BaseEntity, Torrent, TorrentFile, User } from '../entities';

const config: Options = {
  type: 'sqlite',
  entities: [BaseEntity, Torrent, TorrentFile, User],
  migrations: {
    tableName: 'migrations',
    path: `${process.cwd()}/migrations`,
    emit: 'ts'
  },
  highlighter: new SqlHighlighter(),
  // force the dates to be saved in UTC in datetime columns without timezone
  forceUtcTimezone: true
};

export default config;
