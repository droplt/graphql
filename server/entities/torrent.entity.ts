import { Collection, getRepository } from 'fireorm';
import { Field, ID, ObjectType } from 'type-graphql';

export interface ITorrentModel {
  id: string;
  name: string;
}

@ObjectType('Torrent')
@Collection('Torrents')
export class TorrentModel implements ITorrentModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
}

export const torrentRepository = getRepository(TorrentModel);
