// staff.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { Restaurant } from './restaurant.entity';
import { StaffRole } from 'src/common/enums/staff-role.enum';
@Entity('staff')
export class Staff {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.staffAssignments)
    user: User;

    @ManyToOne(() => Restaurant, (restaurant) => restaurant.staff)
    restaurant: Restaurant;

    @Column({
        type: 'enum',
        enum: StaffRole,
        default: StaffRole.HELPER,
    })
    role: StaffRole;
}
