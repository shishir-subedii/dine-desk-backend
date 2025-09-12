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

    // The user who submitted the application
    @ManyToOne(() => User, { nullable: false })
    applicant: User;

    // Business info
    @Column({ type: 'varchar' })
    restaurantName: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'varchar' })
    logo: string; // can store logo even during application

    // Contact info
    @Column({ type: 'varchar' })
    contactPersonName: string;

    @Column({ type: 'varchar' })
    contactEmail: string;

    @Column({ type: 'varchar' })
    contactNumber: string;

    // Company info (aligns with Restaurant entity) //TODO: Maybe add registeredCountry as enum? 
    @Column({ type: 'varchar' })
    registeredCountry: string;

    @Column({ type: 'varchar' })
    registeredAddress: string;

    @Column({ type: 'varchar' })
    companyEmail: string;

    @Column({ type: 'varchar' })
    companyPhone: string;

    // City of operation (useful for assigning regional team)
    @Column({ type: 'varchar' })
    city: string;

    // Legal / compliance
    @Column({ type: 'varchar' })
    requiredDocuments: string; // maybe later make it a JSON or relation

    // Status tracking
    @Column({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.PENDING,
    })
    status: ApplicationStatus;

    @ManyToOne(() => User, { nullable: true })
    reviewedBy: User | null; // staff ID or name who reviewed

    @Column({ type: 'timestamptz', nullable: true })
    reviewedAt: Date | null;

    @Column({ type: 'text', nullable: true })
    rejectionReason: string | null;

    @CreateDateColumn({ type: 'timestamptz' })
    appliedAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
