import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { RestaurantModule } from 'src/restaurant/restaurant.module';

@Module({
  imports: [RestaurantModule],
  controllers: [BranchController],
  providers: [BranchService],
})
export class BranchModule {}
