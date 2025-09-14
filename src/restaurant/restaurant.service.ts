import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { User } from 'src/user/entity/user.entity';
import { Application } from 'src/application/entities/application.entity';
import { Staff } from './entities/staff.entity';
import { UserRole } from 'src/common/enums/auth-roles.enum';
import { StaffRole } from 'src/common/enums/staff-role.enum';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
    @InjectRepository(Staff)
    private readonly staffRepo: Repository<Staff>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource
  ) { }

  //Restaurant end points
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
      relations: ['owner', 'menuItems'],
    });
    if (!restaurants) {
      throw new NotFoundException('No restaurant found for this user');
    }
    return restaurants;
  }

  //Staff end points
  //create staff
  async createStaff(ownerId: string, restaurantId: string, userEmail: string, role: StaffRole) {
    return await this.dataSource.transaction(async (manager) => {
      const restaurant = await manager.getRepository(Restaurant).findOne({
        where: { id: restaurantId, owner: { id: ownerId } },
        relations: ['owner'],
      });

      if (!restaurant) {
        throw new NotFoundException('Restaurant not found or does not belong to the owner');
      }

      const user = await manager.getRepository(User).findOne({
        where: { email: userEmail, role: UserRole.USER },
      });

      if (!user) {
        throw new NotFoundException('User not found or already assigned a role');
      }

      // Create staff entry
      const staff = manager.getRepository(Staff).create({
        user: { id: user.id } as User,
        restaurant: { id: restaurantId } as Restaurant,
        role,
      });

      // Update user role to STAFF
      await manager.getRepository(User).update({ id: user.id }, { role: UserRole.STAFF });

      // Save staff record
      return await manager.getRepository(Staff).save(staff);
    });
  }

  //find all staffs
  async findAllStaffs(ownerId: string) {
    return await this.dataSource.transaction(async (manager) => {
      const restaurant = await manager
        .getRepository(Restaurant)
        .findOne({
          where: { owner: { id: ownerId } },
          relations: ['staff', 'staff.user'],
        });
      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }
      return restaurant.staff;
    });
  }

  //find one staff
  async findOneStaff(ownerId: string, staffId: string) {
    return await this.dataSource.transaction(async (manager) => {
      const staff = await manager.getRepository(Staff).findOne({
        where: { id: staffId },
        relations: ['user', 'restaurant', 'restaurant.owner'],
      });

      if (!staff) {
        throw new NotFoundException('Staff not found');
      }

      // Verify restaurant belongs to the given owner
      if (staff.restaurant.owner.id !== ownerId) {
        throw new ForbiddenException(
          'This restaurant does not belong to the owner',
        );
      }

      return staff;
    });
  }

  //remove staff
  async removeStaff(ownerId: string, staffEmail: string) {
    return await this.dataSource.transaction(async (manager) => {
      // Find staff by user email (not by staff.id)
      const staff = await manager.getRepository(Staff).findOne({
        where: { user: { email: staffEmail } },
        relations: ['user', 'restaurant', 'restaurant.owner'],
      });

      if (!staff) {
        throw new NotFoundException('Staff not found');
      }

      // Verify restaurant belongs to the given owner
      if (staff.restaurant.owner.id !== ownerId) {
        throw new ForbiddenException(
          'This restaurant does not belong to the owner',
        );
      }

      // Update user role back to USER
      await manager.getRepository(User).update(
        { id: staff.user.id },
        { role: UserRole.USER },
      );

      // Remove staff record
      await manager.getRepository(Staff).remove(staff);

      return { message: 'Staff removed successfully' };
    });
  }

}
