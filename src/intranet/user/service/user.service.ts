import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from 'src/intranet/user/repository/user.repository';
import { UserCreateDTO } from 'src/intranet/user/dto/user-create.dto';
import { DataSource, QueryRunner } from 'typeorm';
import { UserReadDTO } from '../dto/user-read.dto';
import { EncryptionService } from 'src/utils/encryption/encryption.service';
import { RoleRepository } from 'src/intranet/user/repository/role.repository';
import { RoleName } from '../enum/role.enum';
import { InjectMapper } from '@automapper/nestjs';
import { UserEntity } from '../model/user.entity';
import { Mapper } from '@automapper/core';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly queryRunner: QueryRunner;
  constructor(
    @Inject(DataSource) private readonly dataSource: DataSource,
    @Inject() private readonly userRepository: UserRepository,
    @Inject() private readonly roleRepository: RoleRepository,
    @Inject() private readonly encryptionService: EncryptionService,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {
    this.queryRunner = this.dataSource.createQueryRunner();
  }

  async signout(): Promise<void> {}

  async registerNewUser(userCreateDTO: UserCreateDTO): Promise<UserReadDTO> {
    try {
      const role = await this.roleRepository.findOne({
        where: { roleName: RoleName.SUPER_ADMIN },
      });
      let user = this.userRepository.create({
        ...userCreateDTO,
        roles: [role],
      });
      user.password = await this.encryptionService.hashPassowrd(user.password);
      user = await this.userRepository.save(user);
      return this.classMapper.mapAsync(user, UserEntity, UserReadDTO);
    } catch (error) {
      this.logger.error('[UserService]: Fn: signup: ', error);
      throw error;
    }
  }

  async getById(externalId: string): Promise<UserReadDTO> {
    try {
      await this.queryRunner.startTransaction();
      const user = await this.userRepository.findOne({
        where: {
          internalId: await this.encryptionService.decryptValue(externalId),
        },
        relations: { roles: true },
      });
      await this.queryRunner.commitTransaction();
      return this.classMapper.mapAsync(user, UserEntity, UserReadDTO);
    } catch (error) {
      this.logger.error('[UserService]: Fn: signup: ', error);
      await this.queryRunner.rollbackTransaction();
      throw error;
    }
  }

  async getByEmail(email: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOne({
        where: {
          email,
        },
        relations: { roles: true },
      });
    } catch (error) {
      this.logger.error('[UserService]: Fn: getByEmail: ', error);
      throw error;
    }
  }

  async getAll(): Promise<UserReadDTO[]> {
    try {
      const users = await this.userRepository.find({
        relations: { roles: true },
      });
      return await Promise.all(
        users.map((entity) => {
          return this.classMapper.mapAsync(entity, UserEntity, UserReadDTO);
        }),
      );
    } catch (error) {
      this.logger.error('[UserService]: Fn: getAll: ', error);
      throw error;
    }
  }

  async updateById(
    externalId: string,
    { firstname, lastname, isActive, isVerified }: UserReadDTO,
  ): Promise<void> {
    try {
      await this.queryRunner.startTransaction();
      await this.userRepository.update(
        {
          internalId: await this.encryptionService.decryptValue(externalId),
        },
        { firstname, lastname, isActive, isVerified },
      );
      await this.queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error('[UserService]: Fn: updateById: ', error);
      await this.queryRunner.rollbackTransaction();
      throw error;
    }
  }
}
