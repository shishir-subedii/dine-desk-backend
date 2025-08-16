import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToMany, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { Branch } from 'src/branch/entities/branch.entity';

@Entity('restaurants')
export class Restaurant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    logo: string;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => User, (user) => user.restaurantsOwned)
    owner: User;

    @OneToMany(() => Branch, (branch) => branch.restaurant)
    branches: Branch[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}