import { Options } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

import { Base } from '../../entities/Base';
import { Torrent } from '../../entities/Torrent';
import { TorrentFile } from '../../entities/TorrentFile';
import { User } from '../../entities/User';

const config: Options = {
  type: 'sqlite',
  entities: [Base, Torrent, TorrentFile, User],
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
