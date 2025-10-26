import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePokemonDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  types: string[];
}
