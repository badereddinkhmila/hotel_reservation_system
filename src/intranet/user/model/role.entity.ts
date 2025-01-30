import { Column, Entity, ManyToMany } from 'typeorm';
import { RoleName } from '../enum/role.enum';
import { UserEntity } from './user.entity';
import BaseEntity from 'src/intranet/common/base-entity';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'roles' })
export class RoleEntity extends BaseEntity {
  /*###############################################################*/
  /*#####################     Properties      #####################*/
  /*###############################################################*/

  @Column({
    name: 'role_name',
    type: 'enum',
    enum: RoleName,
    default: RoleName.USER,
  })
  @AutoMap()
  roleName: RoleName;

  /*###############################################################*/
  /*#####################    Relationships    #####################*/
  /*###############################################################*/

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];
}
