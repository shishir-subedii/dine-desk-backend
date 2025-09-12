import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { User } from 'src/user/entity/user.entity';
import { Application } from 'src/application/entities/application.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
  ) { }

  async create(createRestaurantDto: CreateRestaurantDto, owner: User, application: Application) {
    const restaurant = this.restaurantRepo.create({
      ...createRestaurantDto,
      owner,
      application,
    });

    return await this.restaurantRepo.save(restaurant);
  }

  async findMyRestaurant(ownerId: string) {
    const restaurants = await this.restaurantRepo.findOne({
      where: { owner: { id: ownerId } },
      relations: ['owner', 'branches'],
    });
    if (!restaurants) {
      throw new NotFoundException('No restaurant found for this user');
    }
    return restaurants;
  }
}
