import {
  MappingProfile,
  createMap,
  forMember,
  ignore,
  extend,
  beforeMap,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/core';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../model/user.entity';
import { UserReadDTO } from '../dto/user-read.dto';
import { UserCreateDTO } from '../dto/user-create.dto';
import { UserSigninDTO } from '../dto/user-signin.dto';
import { EncryptionService } from 'src/utils/encryption/encryption.service';
import { RoleReadDTO } from '../dto/role-read.dto';
import { RoleEntity } from '../model/role.entity';
import { ReadBaseDTO } from '../../common/base-read.dto';
import { BaseEntity } from 'typeorm';

@Injectable()
export class UserMapper extends AutomapperProfile {
  private readonly logger = new Logger(UserMapper.name);
  constructor(
    @InjectMapper() mapper: Mapper,
    @Inject() private readonly encryptionService: EncryptionService,
  ) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      const baseMapping = createMap(mapper, BaseEntity, ReadBaseDTO);
      createMap(mapper, RoleEntity, RoleReadDTO);
      createMap(
        mapper,
        UserEntity,
        UserReadDTO,
        beforeMap(async (source, destination) => {
          destination.externalId = await this.encryptionService.encryptValue(
            source.internalId,
          );
          destination.roles = mapper.mapArray(
            source.roles,
            RoleEntity,
            RoleReadDTO,
          );
        }),
        extend(baseMapping),
      );
      createMap(
        mapper,
        UserCreateDTO,
        UserEntity,
        forMember((dest) => dest.internalId, ignore()),
        extend(baseMapping),
      );
      createMap(mapper, UserSigninDTO, UserEntity, extend(baseMapping));
    };
  }
}
