import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';

@Entity('vouchers')
export class Voucher {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    code: string; // e.g. SAVE10

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    discountAmount: number; // Flat discount

    @Column('decimal', { precision: 5, scale: 2, nullable: true })
    discountPercent: number; // e.g. 10 means 10%

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    discountCap: number; // Flat discount

    @Column({ type: 'timestamp', nullable: true })
    validFrom: Date;

    @Column({ type: 'timestamp', nullable: true })
    validUntil: Date;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => Restaurant)
    restaurant: Restaurant;
}
