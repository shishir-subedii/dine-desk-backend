import { Injectable, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { userPayloadType } from 'src/common/types/auth.types';
import { MenuItem } from './entities/menu.entity';
import { CreateMenuItemDto } from './dto/create-menu.dto';
import { User } from 'src/user/entity/user.entity';
import { Staff } from 'src/restaurant/entities/staff.entity';
import { UserRole } from 'src/common/enums/auth-roles.enum';

///TODO: Add transaction
@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuRepo: Repository<MenuItem>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  async checkAccess(
    restaurantId: string,
    person: userPayloadType,
  ): Promise<Restaurant> {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: restaurantId },
      relations: ['owner'],
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found or access denied');
    }

    if (person.role === UserRole.RESTAURANT_OWNER && restaurant.owner.id !== person.id) {
      throw new MethodNotAllowedException(
        'You are not allowed to access this route',
      );
    }

    if (person.role === UserRole.STAFF) {
      const findUser = await this.userRepo.findOne({
        where: { id: person.id },
        relations: [
          'staffAssignments',
          'staffAssignments.restaurant',
          'staffAssignments.restaurant.owner',
        ],
      });

      if (findUser?.staffAssignments?.restaurant?.id !== restaurant.id) {
        throw new MethodNotAllowedException(
          'You are not allowed to access this route',
        );
      }
    }

    return restaurant;
  }

  async createMenu(dto: CreateMenuItemDto, fileUrl: string, person: userPayloadType) {
    const restaurant = await this.checkAccess(dto.restaurantId, person);

    //create menu item
    const menuItem = this.menuRepo.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      category: dto.category,
      imageUrl: fileUrl,
      restaurant: restaurant,
    });
    return this.menuRepo.save(menuItem);
  }

  //get all menu items for a restaurant with pagination
  async getMenuItems(restaurantId: string, person: userPayloadType, page: number = 1, limit: number = 10) {
     await this.checkAccess(restaurantId, person);
    
    const [findMenus, total] = await this.menuRepo.findAndCount({
      where: { restaurant: { id: restaurantId } },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: findMenus,
      total,
      page,
      limit,
    };
  }

  //find single menu item by id
  async findMenuById(id: string, person: userPayloadType) {
    const menuItem = await this.menuRepo.findOne({
      where: { id },
      relations: ['restaurant', 'restaurant.owner'],
    });
    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }
    await this.checkAccess(menuItem.restaurant.id, person);
    return menuItem;
  }

  //delete menu item by id
  async deleteMenuById(id: string, person: userPayloadType) {
    const menuItem = await this.menuRepo.findOne({
      where: { id },
      relations: ['restaurant', 'restaurant.owner'],
    });
    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }
    await this.checkAccess(menuItem.restaurant.id, person);
    await this.menuRepo.remove(menuItem);
    return { message: 'Menu item deleted successfully' };
  }

  //TODO: update menu item by id


}
