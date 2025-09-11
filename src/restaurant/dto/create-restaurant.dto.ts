import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateRestaurantDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    logo?: string;

    @ApiProperty()
    @IsString()
    requiredDocuments: string;

    @ApiProperty()
    @IsString()
    registeredCountry: string;

    @ApiProperty()
    @IsString()
    registeredAddress: string;

    @ApiProperty()
    @IsEmail()
    companyEmail: string;

    @ApiProperty()
    @IsString()
    companyPhone: string;
}
