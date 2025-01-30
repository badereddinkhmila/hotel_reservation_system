import { AutoMap } from '@automapper/classes';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class UserCreateDTO {
  @MinLength(3)
  @IsOptional()
  @AutoMap()
  firstname: string;

  @MinLength(3)
  @IsNotEmpty()
  @AutoMap()
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  @AutoMap()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @IsNotEmpty()
  @AutoMap()
  password: string;
}
