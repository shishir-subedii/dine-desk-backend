import { ApplicationStatus } from 'src/common/enums/application-status.enum';
import { User } from 'src/user/entity/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('applications')
export class Application {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // The user who submitted the application
    @ManyToOne(() => User, { eager: true })
    applicant: User;

    // Business info
    @Column()
    restaurantName: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    logo: string; // can store logo even during application

    // Contact info
    @Column()
    contactPersonName: string;

    @Column()
    contactEmail: string;

    @Column()
    contactNumber: string;

    // Company info (aligns with Restaurant entity)
    @Column()
    registeredCountry: string;

    @Column()
    registeredAddress: string;

    @Column()
    companyEmail: string;

    @Column()
    companyPhone: string;

    // City of operation (useful for assigning regional team)
    @Column()
    city: string;

    // Legal / compliance
    @Column()
    requiredDocuments: string; // maybe later make it a JSON or relation

    // Status tracking
    @Column({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.PENDING,
    })
    status: ApplicationStatus;

    @Column({ nullable: true })
    reviewedBy: string; // staff ID or name who reviewed

    @Column({ type: 'timestamp', nullable: true })
    reviewedAt: Date;

    @Column({ nullable: true })
    rejectionReason: string;

    @CreateDateColumn()
    appliedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
