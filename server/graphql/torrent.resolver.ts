import { Query, Resolver } from 'type-graphql';

import { TorrentModel, torrentRepository } from '../entities';

@Resolver(() => TorrentModel)
export class TorrentResolver {
  @Query(() => [TorrentModel])
  async torrents(): Promise<TorrentModel[]> {
    return torrentRepository.limit(10).find();
  }
}
