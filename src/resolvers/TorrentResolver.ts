import { Query, Resolver } from 'type-graphql';

import { Torrent } from '../entities/Torrent';
import { Em } from '../utils/decorators/em';

@Resolver(() => Torrent)
export class TorrentResolver {
  @Query(() => [Torrent])
  async torrents(@Em() { torrentsRepository }: Em): Promise<Torrent[]> {
    return torrentsRepository.findAll();
  }
}
