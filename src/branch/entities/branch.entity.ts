import { MenuItem } from 'src/menu/entities/menu.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

// import { Order } from 'src/orders/entities/order.entity';

@Entity('branches')
export class Branch {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    address: string;

    @Column()
    city: string;

    @Column()
    phoneNumber: string;

    @ManyToOne(() => Restaurant, (restaurant) => restaurant.branches)
    restaurant: Restaurant;

    @OneToMany(() => MenuItem, (menuItem) => menuItem.branch)
    menuItems: MenuItem[];

    // @OneToMany(() => Order, (order) => order.branch)
    // orders: Order[];
}