import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { RoleEntity } from './role.entity';
import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import BaseEntity from 'src/intranet/common/base-entity';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  /*###############################################################*/
  /*#####################     Properties      #####################*/
  /*###############################################################*/

  @Column({
    type: 'varchar',
    length: 32,
  })
  @AutoMap()
  firstname: string;

  @Column({
    type: 'varchar',
    length: 32,
  })
  @IsNotEmpty()
  @MinLength(3)
  @AutoMap()
  lastname: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @AutoMap()
  email: string;

  @Column({
    type: 'varchar',
  })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @IsNotEmpty()
  password: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  @AutoMap()
  isActive: boolean;

  @Column({
    name: 'is_verified',
    type: 'boolean',
    default: false,
  })
  @AutoMap()
  isVerified: boolean;

  /*###############################################################*/
  /*#####################    Relationships    #####################*/
  /*###############################################################*/

  @ManyToMany(() => RoleEntity, (roleEntity) => roleEntity.users)
  @JoinTable({
    name: 'users_roles_relation',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'internalId',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'internalId',
    },
  })
  @AutoMap()
  roles: RoleEntity[];
}
