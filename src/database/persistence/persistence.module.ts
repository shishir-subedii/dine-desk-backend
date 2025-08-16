// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from 'src/branch/entities/branch.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User } from 'src/user/entity/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Restaurant,
            Branch
        ]),
    ],
    exports: [TypeOrmModule], // Export so other modules can inject repositories
})
export class PersistenceModule { }
