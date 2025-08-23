import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';

@Entity('vouchers')
export class Voucher {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar' })
    code: string; // e.g. SAVE10

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    discountAmount: number | null; // Flat discount

    @Column('decimal', { precision: 5, scale: 2, nullable: true })
    discountPercent: number | null; // e.g. 10 means 10%

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    discountCap: number | null; // Max discount allowed

    @Column({ type: 'timestamptz', nullable: true })
    validFrom: Date | null;

    @Column({ type: 'timestamptz', nullable: true })
    validUntil: Date | null;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @ManyToOne(() => Restaurant)
    restaurant: Restaurant;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
