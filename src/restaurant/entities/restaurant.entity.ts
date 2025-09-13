import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    OneToMany,
    UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { Branch } from 'src/branch/entities/branch.entity';
import { Application } from 'src/application/entities/application.entity';
import { GenericMenu } from 'src/menu/entities/generic_menu.entity';

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

    @OneToMany(() => GenericMenu, (menu) => menu.restaurant)
    menuItems: GenericMenu[];

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

    @OneToMany(() => Branch, (branch) => branch.restaurant)
    branches: Branch[];

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
