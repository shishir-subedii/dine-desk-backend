import { MenuItem } from 'src/menu/entities/menu.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';


@Entity('branches')
export class Branch {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // --- Address fields ---
    @Column({ type: 'varchar', length: 255 })
    addressDescription: string; // e.g. "5th floor, near main gate"

    @Column('decimal', { precision: 10, scale: 7 })
    latitude: number;

    @Column('decimal', { precision: 10, scale: 7 })
    longitude: number;

    @Column()
    city: string;

    @Column()
    phoneNumber: string;

    @ManyToOne(() => Restaurant, (restaurant) => restaurant.branches)
    restaurant: Restaurant;

    @OneToMany(() => MenuItem, (menuItem) => menuItem.branch)
    menuItems: MenuItem[];
}