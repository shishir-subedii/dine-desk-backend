import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurant.service';
import { JwtAuthGuard } from 'src/common/auth/AuthGuard';
import { userPayloadType } from 'src/common/types/auth.types';
import { Roles } from 'src/common/auth/AuthRoles';
import { UserRole } from 'src/common/enums/auth-roles.enum';
import { StaffRole } from 'src/common/enums/staff-role.enum';
import { CreateStaffDto, findStaffByEmailDto } from './dto/staff.dto';

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
  async findMyRestaurants(@Req() req: Request) {
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
      dto.userEmail,        // which user to assign as staff
      dto.role,          // role of staff
    );

    return {
      success: true,
      data,
      message: 'Staff created successfully',
    };
  }

  @Get('staff/all')
  @Roles(UserRole.RESTAURANT_OWNER)
  @ApiOperation({ summary: 'Find all staffs for owner’s restaurant' })
  @ApiResponse({ status: 200, description: 'List of staffs returned' })
  async findAllStaffs(@Req() req: Request) {
    const owner = req['user'] as userPayloadType;
    const data = await this.restaurantService.findAllStaffs(owner.id);

    return { success: true, data, message: 'Staffs fetched successfully' };
  }

  @Get('staff/:staffId')
  @Roles(UserRole.RESTAURANT_OWNER)
  @ApiOperation({ summary: 'Find one staff by staffId' })
  @ApiParam({
    name: 'staffId',
    type: 'string',
    description: 'ID of the staff',
  })
  @ApiResponse({ status: 200, description: 'Staff details returned' })
  async findOneStaff(
    @Param('staffId') staffId: string,
    @Req() req: Request,
  ) {
    const owner = req['user'] as userPayloadType;
    const data = await this.restaurantService.findOneStaff(owner.id, staffId);

    return { success: true, data, message: 'Staff fetched successfully' };
  }

  @Delete('staff/remove')
  @Roles(UserRole.RESTAURANT_OWNER)
  @ApiOperation({ summary: 'Remove staff by email' })
  @ApiResponse({ status: 200, description: 'Staff removed successfully' })
  async removeStaff(@Body() dto: findStaffByEmailDto, @Req() req: Request) {
    const owner = req['user'] as userPayloadType;
    const data = await this.restaurantService.removeStaff(
      owner.id,
      dto.staffEmail,
    );

    return { success: true, data, message: 'Staff removed successfully' };
  }
}



