import { Branch } from 'src/branch/entities/branch.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('menu_items')
export class MenuItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ default: true })
    isAvailable: boolean;

    @ManyToOne(() => Branch, (branch) => branch.menuItems)
    branch: Branch;

    @Column()
    sellCount: number;

    @ManyToOne(() => Restaurant) 
    restaurant: Restaurant;
}