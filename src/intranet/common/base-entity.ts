import {
  CreateDateColumn,
  DeleteDateColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';

export default class BaseEntity {
  @Column({
    name: 'internal_id',
    primary: true,
    generated: 'uuid',
  })
  internalId: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @AutoMap()
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  @AutoMap()
  deletedAt: Date;
}
