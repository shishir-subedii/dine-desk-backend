import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";


export class RejectApplicationDto {
    @ApiProperty({ example: 'Insufficient documents provided', required: false })
    @IsOptional()
    @IsString()
    reason: string;
}
