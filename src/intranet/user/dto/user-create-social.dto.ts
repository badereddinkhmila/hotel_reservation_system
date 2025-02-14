import { AutoMap } from '@automapper/classes';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { AuthProvidersEnum } from 'src/utils/authentification/enum/auth-providers.enum';

export class UserCreateSocialDTO {
  @IsNotEmpty()
  socialId: string;

  @IsOptional()
  @AutoMap()
  firstname?: string;

  @IsOptional()
  @AutoMap()
  lastname?: string;

  @IsEmail()
  @IsOptional()
  @AutoMap()
  email?: string;

  @IsEnum(AuthProvidersEnum)
  @AutoMap()
  provider: string;
}
