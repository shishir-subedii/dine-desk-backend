// valkey-cache.service.ts
import { Injectable, Inject, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class ValkeyCacheService {
    private readonly defaultTtl: number;
    private isConnected = false;
    private readonly logger = new Logger(ValkeyCacheService.name);

    constructor(@Inject('VALKEY_CLIENT') private readonly client: Redis) {
        this.defaultTtl = parseInt(process.env.VALKEY_TTL || '21600', 10); // default 6h

        this.client.on('ready', () => {
            this.isConnected = true;
            this.logger.log('Connected to Valkey');
        });

        this.client.on('error', (err) => {
            this.isConnected = false;
            this.logger.warn(`Valkey not available: ${err.message}`);
        });
    }

    async set(key: string, value: any, ttl?: number): Promise<'OK' | null> {
        if (!this.isConnected) return null;

        const data = typeof value === 'string' ? value : JSON.stringify(value);
        const expire = ttl ?? this.defaultTtl;

        try {
            return await this.client.set(key, data, 'EX', expire);
        } catch (err) {
            this.logger.error(`Valkey SET error: ${err.message}`);
            return null;
        }
    }

    async get<T = any>(key: string): Promise<T | null> {
        if (!this.isConnected) return null;

        try {
            const data = await this.client.get(key);
            if (!data) return null;

            return JSON.parse(data);
        } catch (err) {
            this.logger.error(`Valkey GET error: ${err.message}`);
            return null;
        }
    }

    async del(key: string): Promise<number> {
        if (!this.isConnected) return 0;

        try {
            return await this.client.del(key);
        } catch (err) {
            this.logger.error(`Valkey DEL error: ${err.message}`);
            return 0;
        }
    }

    async flushAll(): Promise<'OK' | null> {
        if (!this.isConnected) return null;

        try {
            return await this.client.flushall();
        } catch (err) {
            this.logger.error(`Valkey FLUSH error: ${err.message}`);
            return null;
        }
    }

    async delByPrefix(prefix: string): Promise<number> {
        if (!this.isConnected) return 0;

        let cursor = '0';
        let totalDeleted = 0;

        try {
            do {
                const [newCursor, keys] = await this.client.scan(
                    cursor,
                    'MATCH',
                    `${prefix}*`,
                    'COUNT',
                    100
                );

                if (keys.length > 0) {
                    const deleted = await this.client.del(...keys);
                    totalDeleted += deleted;
                }

                cursor = newCursor;
            } while (cursor !== '0');
        } catch (err) {
            this.logger.error(`Valkey SCAN error: ${err.message}`);
        }

        return totalDeleted;
    }
}
