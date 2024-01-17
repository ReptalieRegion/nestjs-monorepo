import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { redisStore } from 'cache-manager-redis-yet';

import type { RedisClientOptions } from 'redis';

export const CustomRedisModule = CacheModule.registerAsync<RedisClientOptions>({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        url: configService.get<string>('REDIS_URI'),
        database: 0,
        ttl: 14 * 24 * 60 * 60,
    }),
    inject: [ConfigService],
});
