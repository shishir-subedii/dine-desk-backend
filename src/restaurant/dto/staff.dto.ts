// dto/create-staff.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { StaffRole } from 'src/common/enums/staff-role.enum';

export class CreateStaffDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    @IsNotEmpty()
    userEmail: string;

    @ApiProperty({ example: 'waiter', enum: StaffRole })
    @IsEnum(StaffRole)
    role: StaffRole;
}

export class FindOneStaffDto {
    @ApiProperty({ example: '123-456-789', description: 'ID of the staff' })
    @IsUUID()
    @IsNotEmpty()
    staffId: string;
}

export class findStaffByEmailDto {
    @ApiProperty({
        example: 'staff@email.com',
        description: 'Email of the staff user to find',
    })
    @IsEmail()
    @IsNotEmpty()
    staffEmail: string;
}
