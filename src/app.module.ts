
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { AppConfigModule } from './common/config/config.module';
import { DatabaseModule } from './database/database.module';
import { JwtmoduleModule } from './common/jwtmodule/jwtmodule.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ValkeyModule } from './valkey/valkey.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { BranchModule } from './branch/branch.module';
import { PersistenceModule } from './database/persistence/persistence.module';
import { CoreModule } from './common/core/core.module';

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
    DatabaseModule, UsersModule, AuthModule, AppConfigModule, JwtmoduleModule, RestaurantModule, BranchModule, CoreModule, 
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // add throttler guard globally
    },
  ],
})
export class AppModule { }
