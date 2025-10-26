import { DefaultValuePipe } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateIf } from 'class-validator';

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
    sortBy?: string;

    @ValidateIf((obj) => obj.sortBy !== undefined)
    @IsNotEmpty({ message: 'sortOrder is required when sortBy is provided' })
    @IsString()
    sortOrder?: string;
}