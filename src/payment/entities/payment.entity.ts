import { paymentMethods } from 'src/common/enums/payment-methods.enum';
import { paymentStatus } from 'src/common/enums/payment-status.enum';
import { Order } from 'src/order/entities/order.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Order, (order) => order.payment)
    order: Order;

    @Column({
        type: 'enum',
        enum: paymentMethods,
        default: paymentMethods.COD,
    })
    method: paymentMethods;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({
        type: 'enum',
        enum: paymentStatus,
        default: paymentStatus.PENDING,
    })
    status: paymentStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}