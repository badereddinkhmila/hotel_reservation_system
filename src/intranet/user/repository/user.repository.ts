import { UserEntity } from '../model/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/intranet/common/base-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(@Inject(DataSource) private readonly dataSource: DataSource) {
    super(UserEntity, dataSource);
  }
}
