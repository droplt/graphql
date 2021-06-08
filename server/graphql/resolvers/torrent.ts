import { Query, Resolver } from 'type-graphql';

import { repository, Torrent } from '../../entities/torrent';

@Resolver(() => Torrent)
export class TorrentResolver {
  @Query(() => [Torrent])
  async torrents(): Promise<Torrent[]> {
    return repository.limit(10).find();
  }
}
