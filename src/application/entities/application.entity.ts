import { ApplicationStatus } from 'src/common/enums/application-status.enum';
import { User } from 'src/user/entity/user.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('applications')
export class Application {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { nullable: false })
    applicant: User;

    @Column({ type: 'varchar' })
    restaurantName: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'varchar' })
    logo: string;

    @Column({ type: 'varchar' })
    contactPersonName: string;

    @Column({ type: 'varchar' })
    contactEmail: string;

    @Column({ type: 'varchar' })
    contactNumber: string;

    @Column({ type: 'varchar' })
    registeredCountry: string;

    @Column({ type: 'varchar' })
    registeredAddress: string;

    @Column({ type: 'varchar' })
    companyEmail: string;

    @Column({ type: 'varchar' })
    companyPhone: string;

    @Column({ type: 'varchar' })
    city: string;

    @Column({ type: 'varchar' })
    requiredDocuments: string;

    // --- New fields ---
    @Column({ type: 'varchar', length: 255 })
    addressDescription: string;

    @Column('decimal', { precision: 10, scale: 7 })
    latitude: number;

    @Column('decimal', { precision: 10, scale: 7 })
    longitude: number;

    @Column({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.PENDING,
    })
    status: ApplicationStatus;

    @ManyToOne(() => User, { nullable: true })
    reviewedBy: User | null;

    @Column({ type: 'timestamptz', nullable: true })
    reviewedAt: Date | null;

    @Column({ type: 'text', nullable: true })
    rejectionReason: string | null;

    @CreateDateColumn({ type: 'timestamptz' })
    appliedAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}

