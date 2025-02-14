import { IsNotEmpty, IsOptional } from 'class-validator';
import { ReadBaseDTO } from 'src/intranet/common/base-read.dto';
import { RoleReadDTO } from './role-read.dto';
import { AutoMap } from '@automapper/classes';
import { AuthProvidersEnum } from 'src/utils/authentification/enum/auth-providers.enum';

export class UserReadDTO extends ReadBaseDTO {
  @IsNotEmpty()
  @IsOptional()
  @AutoMap()
  firstname?: string;

  @AutoMap()
  lastname: string;

  @AutoMap()
  email: string;

  @AutoMap()
  isVerified: boolean;

  @AutoMap()
  isActive: boolean;

  @AutoMap()
  provider: AuthProvidersEnum;

  @IsOptional()
  @AutoMap()
  socialId?: string;

  @AutoMap(() => [RoleReadDTO])
  roles: RoleReadDTO[] = [];
}
