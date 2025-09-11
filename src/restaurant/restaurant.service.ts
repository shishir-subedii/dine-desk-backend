import { Injectable } from '@nestjs/common';
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
}
