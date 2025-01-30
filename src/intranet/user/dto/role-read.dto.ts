import { IsEnum } from 'class-validator';
import { RoleName } from '../enum/role.enum';
import { AutoMap } from '@automapper/classes';

export class RoleReadDTO {
  @IsEnum(RoleName)
  @AutoMap()
  roleName: string;
}
