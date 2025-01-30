import { Exclude } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { AutoMap } from '@automapper/classes';

export class ReadBaseDTO {
  @IsNotEmpty()
  @IsOptional()
  externalId?: string;

  @IsDate()
  @AutoMap()
  createdAt: Date;

  @IsDate()
  @AutoMap()
  updatedAt?: Date;

  @IsDate()
  @AutoMap()
  deletedAt?: Date;

  @Exclude()
  @IsNotEmpty()
  internalId: string;
}
