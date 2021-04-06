import { createWriteStream } from 'fs';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { EntityManager, Repository } from 'typeorm';
import { InjectManager } from 'typeorm-typedi-extensions';

import { TorrentModel } from '../entities';
import { FindTorrentArgs } from './torrent.inputs';

@Service()
@Resolver(() => TorrentModel)
export class TorrentResolver {
  @InjectManager()
  private manager: EntityManager;

  get torrentRepo(): Repository<TorrentModel> {
    return this.manager.getRepository(TorrentModel);
  }

  @Query(() => [TorrentModel])
  torrents(
    @Args() { orderBy, direction, ...options }: FindTorrentArgs
  ): Promise<TorrentModel[]> {
    const order = {
      [orderBy ? orderBy : '']: direction
    };
    return this.torrentRepo.find({ ...options, order });
  }

  @Query(() => TorrentModel)
  torrent(@Arg('hash') hash: string): Promise<TorrentModel | undefined> {
    return this.torrentRepo.findOne({ where: { hash } });
  }

  @Mutation(() => Boolean)
  async addTorrent(
    @Arg('torrent', () => GraphQLUpload)
    { createReadStream, filename }: FileUpload
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      createReadStream()
        .pipe(createWriteStream(__dirname + `../../tmp/torrents/${filename}`))
        .on('finish', () => resolve(true))
        .on('error', () => reject(false));
    });
  }

  // @Mutation(() => TorrentModel)
  // async createTorrent(
  //   @Arg('data') data: CreateTorrentInput
  // ): Promise<TorrentModel> {
  //   return this.torrentRepo.save(data);
  // }

  // @Mutation(() => TorrentModel)
  // async updateTorrent(
  //   @Arg('hash') hash: string,
  //   @Arg('data') data: UpdateTorrentInput
  // ): Promise<TorrentModel | undefined> {
  //   await this.torrentRepo.update(hash, data);
  //   return this.torrentRepo.findOne(hash);
  // }

  // @Mutation(() => Boolean)
  // async deleteTorrent(@Arg('hash') hash: string): Promise<boolean> {
  //   await this.torrentRepo.softDelete(hash);
  //   return true;
  // }
}
