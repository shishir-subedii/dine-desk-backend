
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { AppConfigModule } from './common/config/config.module';
import { DatabaseModule } from './database/database.module';
import { JwtmoduleModule } from './common/jwtmodule/jwtmodule.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RestaurantModule } from './restaurant/restaurant.module';
import { CoreModule } from './common/core/core.module';
import { MenuModule } from './menu/menu.module';
import { OrderModule } from './order/order.module';
import { DeliveryModule } from './delivery/delivery.module';
import { VoucherModule } from './voucher/voucher.module';
import { PaymentModule } from './payment/payment.module';
import { ApplicationModule } from './application/application.module';
import { MailModule } from './common/mail/mail.module';
import { FileUploadModule } from './file-upload/file-upload.module';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            name: 'default',
            ttl: configService.get<number>('RATE_LIMIT_TTL', 60000),
            limit: configService.get<number>('RATE_LIMIT_MAX', 70),
          },
        ],
      }),
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    AppConfigModule,
    JwtmoduleModule,
    RestaurantModule,
    CoreModule,
    MenuModule,
    OrderModule,
    DeliveryModule,
    VoucherModule,
    PaymentModule,
    ApplicationModule,
    MailModule,
    FileUploadModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // add throttler guard globally
    },
  ],
})
export class AppModule { }
