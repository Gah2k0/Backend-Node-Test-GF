import { Type } from 'class-transformer';
import {
  Equals,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class GetPokemonsQueryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  type?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ValidateIf((obj) => obj.sortOrder !== undefined)
  @IsNotEmpty({ message: 'sortBy is required when sortOrder is provided' })
  @IsString()
  @Equals('name', { message: 'sortBy must be name' })
  sortBy?: string;

  @ValidateIf((obj) => obj.sortBy !== undefined)
  @IsNotEmpty({ message: 'sortOrder is required when sortBy is provided' })
  @IsString()
  @IsIn(['asc', 'desc'], { message: 'sortOrder must be either asc or desc' })
  sortOrder?: string;
}
