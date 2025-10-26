import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class UpdatePokemonDto {
  @ValidateIf(dto => dto.type === undefined)
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ValidateIf(dto => dto.name === undefined)
  @IsNotEmpty()
  type?: string;
}