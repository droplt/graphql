import { Collection, getRepository } from 'fireorm';
import { Field, ID, ObjectType } from 'type-graphql';

export interface ITorrent {
  id: string;
  name: string;
  state: string;
  progress: number;
  size: number;
}

@ObjectType('Torrent')
@Collection('Torrents')
export class Torrent implements ITorrent {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  state: string;

  @Field()
  progress: number;

  @Field()
  size: number;
}

export const repository = getRepository(Torrent);
