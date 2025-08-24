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

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ type: 'varchar', nullable: true })
    name: string | null;

    @Column({ type: 'varchar', select: false, nullable: true })
    password: string | null;

    @Column({
        type: 'text',
        array: true,
        nullable: true,
        default: () => 'ARRAY[]::TEXT[]',
    })
    accessTokens: string[] | null;

    @OneToMany(() => Restaurant, (restaurant) => restaurant.owner)
    restaurantsOwned: Restaurant[];

    @Column({ type: 'varchar', nullable: true })
    phoneNumber: string | null;

    @Column({ type: 'boolean', default: false })
    isVerified: boolean;

    @Column({ type: 'varchar', nullable: true })
    otp: string | null;

    @Column({ type: 'timestamptz', nullable: true })
    otpExpiry: Date | null;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
