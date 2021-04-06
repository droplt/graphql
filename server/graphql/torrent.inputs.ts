import { IsString, Max, Min } from 'class-validator';
import { ArgsType, Field, Int } from 'type-graphql';

import { OrderDirection } from '../types';

@ArgsType()
export class FindTorrentArgs {
  @Field(() => Boolean, { defaultValue: false })
  withDeleted?: boolean;

  @Field(() => Int, { defaultValue: 0 })
  @Min(0)
  skip?: number;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take?: number = 25;

  @Field(() => String, { defaultValue: 'created_at' })
  @IsString()
  orderBy?: string;

  @Field(() => String, { defaultValue: 'DESC' })
  @IsString()
  direction?: OrderDirection;
}
