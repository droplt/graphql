import { Query, Resolver } from 'type-graphql';

import { Torrent } from '../entities';

@Resolver(() => Torrent)
export class TorrentResolver {
  @Query(() => [Torrent])
  async torrents(): Promise<Torrent[]> {
    return [];
  }
}
