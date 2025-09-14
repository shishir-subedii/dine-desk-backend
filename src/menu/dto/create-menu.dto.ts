import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { MenuItemCategory } from 'src/common/enums/menu-category.enum';

export class CreateMenuItemDto {
    @ApiProperty({ example: 'Paneer Butter Masala' })
    @IsString()
    @MinLength(2)
    name: string;

    @ApiProperty({ example: 'Rich and creamy paneer curry' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 250 })
    @Type(() => Number) // <-- This is important
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ example: 'veg', enum: MenuItemCategory })
    @IsOptional()
    @IsEnum(MenuItemCategory)
    category?: MenuItemCategory;

    @ApiProperty({ example: 'uuid-of-restaurant' })
    @IsString()
    restaurantId: string;
}
