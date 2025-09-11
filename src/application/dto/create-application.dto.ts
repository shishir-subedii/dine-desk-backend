// create-application.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApplicationDto {
    @ApiProperty({ example: 'Pizza Palace' })
    @IsString()
    @IsNotEmpty()
    restaurantName: string;

    @ApiPropertyOptional({ example: 'Best pizza in town' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    contactPersonName: string;

    @ApiProperty({ example: 'owner@pizzapalace.com' })
    @IsEmail()
    contactEmail: string;

    @ApiProperty({ example: '+977-9812345678' })
    @IsString()
    //TODO: ADD ISNUMBER VALIDATION LATER
    @IsNotEmpty()
    contactNumber: string;

    @ApiProperty({ example: 'Nepal' })
    @IsString()
    @IsNotEmpty()
    registeredCountry: string;

    @ApiProperty({ example: 'Pokhara-17' })
    @IsString()
    @IsNotEmpty()
    registeredAddress: string;

    @ApiProperty({ example: 'info@pizzapalace.com' })
    @IsEmail()
    companyEmail: string;

    @ApiProperty({ example: '+977-9800000000' })
    @IsString()
    @IsNotEmpty()
    companyPhone: string;

    @ApiProperty({ example: 'Pokhara' })
    @IsString()
    @IsNotEmpty()
    city: string;

    // No file fields here!
}
