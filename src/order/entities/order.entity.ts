import { Branch } from 'src/branch/entities/branch.entity';
import { User } from 'src/user/entity/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { orderStatus } from 'src/common/enums/order-status.enum';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Delivery } from 'src/delivery/entities/delivery.entity';


@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    customer: User;

    @ManyToOne(() => Restaurant)
    restaurant: Restaurant;

    @ManyToOne(() => Branch)
    branch: Branch;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount: number;

    @Column({
        type: 'enum',
        enum: orderStatus,
        default: orderStatus.PENDING
    })
    status: orderStatus

    // --- Address fields ---
    @Column({ type: 'varchar', length: 255 })
    addressDescription: string; // e.g. "5th floor, near main gate"

    @Column('decimal', { precision: 10, scale: 7 })
    latitude: number;

    @Column('decimal', { precision: 10, scale: 7 })
    longitude: number;

    @OneToMany(() => Delivery, (delivery) => delivery.order)
    deliveries: Delivery[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

