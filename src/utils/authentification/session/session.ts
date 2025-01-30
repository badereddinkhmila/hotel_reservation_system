import { RoleEntity } from './../../../intranet/user/model/role.entity';
import { UserEntity } from '../../../intranet/user/model/user.entity';

export class Session {
  id: string;
  user: UserEntity;
  hash: string;
  roles: RoleEntity[];
  views: string[];
  permissions: string[];
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}
