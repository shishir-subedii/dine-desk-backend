import { Branch } from 'src/branch/entities/branch.entity';
import { User } from 'src/user/entity/user.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { orderStatus } from 'src/common/enums/order-status.enum';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Delivery } from 'src/delivery/entities/delivery.entity';
import { Voucher } from 'src/voucher/entities/voucher.entity';
import { Payment } from 'src/payment/entities/payment.entity';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { nullable: false })
    customer: User;

    @ManyToOne(() => Restaurant, { nullable: false })
    restaurant: Restaurant;

    @ManyToOne(() => Branch, { nullable: false })
    branch: Branch;

    @Column({ type: 'varchar' })
    phoneNumber: string;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];

    @Column('decimal', { precision: 10, scale: 2 })
    subtotal: number; // total before discounts

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    discountAmount: number; // total discount applied (voucher + menu discounts)

    @Column('decimal', { precision: 10, scale: 2 })
    total: number; // after discount

    @ManyToOne(() => Voucher, { nullable: true })
    voucher: Voucher | null;

    @Column({
        type: 'enum',
        enum: orderStatus,
        default: orderStatus.PENDING,
    })
    status: orderStatus;

    // --- Address fields ---
    @Column({ type: 'varchar', length: 255 })
    addressDescription: string; // e.g. "5th floor, near main gate"

    @Column('decimal', { precision: 10, scale: 7 })
    latitude: number;

    @Column('decimal', { precision: 10, scale: 7 })
    longitude: number;

    @OneToMany(() => Delivery, (delivery) => delivery.order)
    delivery: Delivery;
    
    @ManyToOne(() => Payment, (payment) => payment.order, { nullable: false })
    payment: Payment;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
}
