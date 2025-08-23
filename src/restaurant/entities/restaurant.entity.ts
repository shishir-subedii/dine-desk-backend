import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToMany, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { Branch } from 'src/branch/entities/branch.entity';
import { Application } from 'src/application/entities/application.entity';

@Entity('restaurants')
export class Restaurant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => Application)
    application: Application;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    logo: string;

    @Column()
    requiredDocuments: string;

    @Column()
    registeredCountry: string;

    @Column()
    registeredAddress: string;

    @Column()
    companyEmail: string;

    @Column()
    companyPhone: string;

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