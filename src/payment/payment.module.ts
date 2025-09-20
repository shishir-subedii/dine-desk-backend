import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { StripeModule } from './stripe/stripe.module';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [StripeModule],
})
export class PaymentModule {}
