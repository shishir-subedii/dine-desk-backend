import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { Application } from 'src/application/entities/application.entity';
import { MenuItem } from 'src/menu/entities/menu.entity';

@Entity('restaurants')
export class Restaurant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar' })
    name: string;

    @ManyToOne(() => Application)
    application: Application;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'varchar', nullable: true })
    logo: string | null;

    @Column({ type: 'varchar' })
    requiredDocuments: string;

    // All menu items now directly belong to restaurant
    @OneToMany(() => MenuItem, (menuItem) => menuItem.restaurant)
    menuItems: MenuItem[];

    // Address fields directly in restaurant
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

    @Column({ type: 'varchar' })
    registeredCountry: string;

    @Column({ type: 'varchar' })
    registeredAddress: string;

    @Column({ type: 'varchar' })
    companyEmail: string;

    @Column({ type: 'varchar' })
    companyPhone: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @ManyToOne(() => User, (user) => user.restaurantsOwned)
    owner: User;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
