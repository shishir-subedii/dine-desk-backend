// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from 'src/branch/entities/branch.entity';
import { Delivery } from 'src/delivery/entities/delivery.entity';
import { MenuItem } from 'src/menu/entities/menu.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';
import { Order } from 'src/order/entities/order.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User } from 'src/user/entity/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Restaurant,
            Branch,
            MenuItem,
            Order,
            OrderItem,
            Delivery
        ]),
    ],
    exports: [TypeOrmModule], // Export so other modules can inject repositories
})
export class PersistenceModule { }
