import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';


//These are branch specific menu items
@Entity('menu_items')
export class MenuItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'varchar', nullable: true })
    imageUrl: string | null;

    @Column({ type: 'boolean', default: true })
    isAvailable: boolean;

    @Column({ type: 'int', default: 0 })
    sellCount: number;

    @ManyToOne(() => Restaurant, { nullable: false })
    restaurant: Restaurant;

    // Discount-specific
    @Column('decimal', {
        precision: 10,
        scale: 2,
        default: 0,
        nullable: true,
    })
    discountAmount: number | null; // Flat discount

    @Column('decimal', {
        precision: 5,
        scale: 2,
        default: 0,
        nullable: true,
    })
    discountPercent: number | null; // e.g. 15 = 15%

    @Column({ type: 'timestamptz', nullable: true })
    discountValidFrom: Date | null;

    @Column({ type: 'timestamptz', nullable: true })
    discountValidUntil: Date | null;

    @Column({ type: 'int', default: 0 })
    discountCap: number;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
