import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class CreateRestaurantDto {
    @ApiProperty({ example: 'Pizza Palace' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 'Best pizza in town' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
    @IsOptional()
    @IsString()
    logo?: string;

    @ApiProperty({ example: 'documents.pdf' })
    @IsString()
    requiredDocuments: string;

    @ApiProperty({ example: 'Nepal' })
    @IsString()
    registeredCountry: string;

    @ApiProperty({ example: 'Pokhara-17' })
    @IsString()
    registeredAddress: string;

    @ApiProperty({ example: 'info@pizzapalace.com' })
    @IsEmail()
    companyEmail: string;

    @ApiProperty({ example: '+977-9800000000' })
    @IsString()
    companyPhone: string;

    // --- New fields for direct restaurant address/location ---
    @ApiProperty({ example: '5th floor, near main gate' })
    @IsString()
    addressDescription: string;

    @ApiProperty({ example: 28.2096 })
    @IsNumber()
    latitude: number;

    @ApiProperty({ example: 83.9856 })
    @IsNumber()
    longitude: number;

    @ApiProperty({ example: '+977-9812345678' })
    @IsString()
    phoneNumber: string;

    @ApiProperty({ example: 'Pokhara' })
    @IsString()
    city: string;
}
