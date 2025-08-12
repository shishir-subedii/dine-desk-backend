// valkey.module.ts
import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { ValkeyCacheService } from './valkeycache.service';

//Please turn on the valkey server before starting the app. 
//BUG: If we turn on valkey server after starting app, the valkey doesn't work there.
@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: 'VALKEY_CLIENT',
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const host = configService.get<string>('VALKEY_HOST', '127.0.0.1');
                const port = configService.get<number>('VALKEY_PORT', 6379);

                const client = new Redis({
                    host,
                    port,
                    // disable endless retrying 
                    //If valkey server is turned on, the app needs to be restarted
                    retryStrategy: () => null,
                });


                client.on('connect', () => console.log('Connected to Valkey'));
                client.on('error', (err) => console.error('Valkey Error', err));
                // client.ping().then(() => console.log('📡 Valkey connection verified'));

                return client;
            },
        },
        ValkeyCacheService,
    ],
    exports: ['VALKEY_CLIENT', ValkeyCacheService],
})
export class ValkeyModule { }

//NOTE: too many valkey cache can take excess RAM. So if more data is being build up on RAM making other server's slow,...
//... we can remove valkey or only use valkey where it's necessary.
