// dto/create-staff.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { StaffRole } from 'src/common/enums/staff-role.enum'; // create an enum CHEF, WAITER, etc.

export class CreateStaffDto {
    @ApiProperty({ example: 'uuid-of-user' })
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ example: 'WAITER', enum: StaffRole })
    @IsEnum(StaffRole)
    role: StaffRole;
}
