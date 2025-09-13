import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurant.service';
import { JwtAuthGuard } from 'src/common/auth/AuthGuard';
import { userPayloadType } from 'src/common/types/auth.types';
import { Roles } from 'src/common/auth/AuthRoles';
import { UserRole } from 'src/common/enums/auth-roles.enum';
import { StaffRole } from 'src/common/enums/staff-role.enum';
import { CreateStaffDto } from './dto/create-staff.dto';

@ApiTags('restaurants')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) { }

  //Restaurant end points
  //TODO: more to do add pagination
  @Get('my-restaurants')
  @Roles(UserRole.RESTAURANT_OWNER)
  @ApiOperation({ summary: 'Get all restaurants for the authenticated user' })
  async findMyRestaurants(@Req() req: Request){
    const user = req['user'] as userPayloadType;
    const data = await this.restaurantService.findMyRestaurant(user.id);
    return {
      success: true,
      data,
      message: 'Restaurant fetched successfully',
    }
  }

  //Staff end points
  //create staff
  @Post('staff/create/:restaurantId')
  @Roles(UserRole.RESTAURANT_OWNER)
  @ApiOperation({ summary: 'Create staff for a restaurant' })
  @ApiParam({ name: 'restaurantId', type: 'string', description: 'ID of the restaurant' })
  @ApiResponse({ status: 201, description: 'Staff created successfully' })
  async createStaff(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: CreateStaffDto,
    @Req() req: Request,
  ) {
    const owner = req['user'] as userPayloadType; // ownerId comes from logged-in user

    const data = await this.restaurantService.createStaff(
      owner.id,          // ownerId (logged-in user)
      restaurantId,      // which restaurant to add staff to
      dto.userId,        // which user to assign as staff
      dto.role,          // role of staff
    );

    return {
      success: true,
      data,
      message: 'Staff created successfully',
    };
  }


}
