import { ApplicationStatus } from 'src/common/enums/application-status.enum';
import { User } from 'src/user/entity/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('applications')
export class Application {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    applicant: User;

    @Column()
    restaurantName: string;

    @Column()
    contactNumber: string;

    @Column()
    city: string;

    @Column()
    description: string;

    @Column({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.PENDING,
    })
    status: ApplicationStatus;

    @Column()
    requiredDocuments: string;

    @CreateDateColumn()
    appliedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}