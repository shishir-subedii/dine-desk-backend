import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';

import { UserRole } from 'src/common/enums/auth-roles.enum';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column({ select: false, nullable: true })
    password: string;

    @Column('text', { array: true, nullable: true, default: () => 'ARRAY[]::TEXT[]' })
    accessTokens: string[];

    @OneToMany(() => Restaurant, (restaurant) => restaurant.owner, {nullable: true})
    restaurantsOwned: Restaurant[];

    // Use enum for stronger typing
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
