import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    SUPERADMIN = 'superadmin',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column({ select: false })
    password: string;

    // Store tokens if you need multi-session support; otherwise, you can remove this
    @Column('text', { array: true, nullable: true, default: () => 'ARRAY[]::TEXT[]' })
    accessTokens: string[];

    // Use enum for stronger typing
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    // Future-proofing: link users to restaurants/branches if needed
    @Column({ nullable: true })
    restaurantId?: string;

    @Column({ nullable: true })
    branchId?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
