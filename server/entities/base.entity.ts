import { Field, ObjectType } from 'type-graphql';
import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
@ObjectType()
export class BaseModel {
  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;
}
