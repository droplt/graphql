import { Collection, getRepository } from 'fireorm';
import { Field, ID, ObjectType } from 'type-graphql';

export interface ITorrent {
  id: string;
  name: string;
}

@ObjectType('Torrent')
@Collection('Torrents')
export class Torrent implements ITorrent {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
}

export const repository = getRepository(Torrent);
