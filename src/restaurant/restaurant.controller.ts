import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurant.service';
import { JwtAuthGuard } from 'src/common/auth/AuthGuard';
import { userPayloadType } from 'src/common/types/auth.types';

@ApiTags('restaurants')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) { }

  //TODO: more to do add pagination
  @Get('my-restaurants')
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
}
