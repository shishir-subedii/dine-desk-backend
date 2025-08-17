import { deliveryStatus } from 'src/common/enums/delivery-status.enum';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entity/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('deliveries')
export class Delivery {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Order, (order) => order.deliveries)
    order: Order;

    //pickup time
    @Column('timestamp')
    pickupTime: Date;

    //deliverytime
    @Column('timestamp')
    deliveryTime: Date;

    //pickup address
    @Column({ type: 'varchar', length: 255 })
    pickupAddress: string;

    @ManyToOne(() => User)
    rider: User;

    @Column({
        type: 'enum',
        enum: deliveryStatus,
        default: deliveryStatus.PENDING,
    })
    status: deliveryStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}