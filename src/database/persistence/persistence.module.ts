// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from 'src/application/entities/application.entity';
import { Delivery } from 'src/delivery/entities/delivery.entity';
import { MenuItem } from 'src/menu/entities/menu.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';
import { Order } from 'src/order/entities/order.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Staff } from 'src/restaurant/entities/staff.entity';
import { User } from 'src/user/entity/user.entity';
import { Voucher } from 'src/voucher/entities/voucher.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Restaurant,
            MenuItem,
            Order,
            OrderItem,
            Delivery,
            Voucher, 
            Payment,
            Staff,
            Application
        ]),
    ],
    exports: [TypeOrmModule], // Export so other modules can inject repositories
})
export class PersistenceModule { }
