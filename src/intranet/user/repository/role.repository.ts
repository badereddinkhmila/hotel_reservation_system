import { BaseRepository } from 'src/intranet/common/base-repository';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RoleEntity } from '../model/role.entity';

@Injectable()
export class RoleRepository extends BaseRepository<RoleEntity> {
  constructor(@Inject(DataSource) private readonly dataSource: DataSource) {
    super(RoleEntity, dataSource);
  }
}
