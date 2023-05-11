import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { CustomRedisModule } from '../../utils/customModules/redis';
import { RedisService } from './redis.service';

@Module({
    imports: [CustomRedisModule],
    providers: [RedisService],
    exports: [RedisService, CacheModule],
})
export class RedisModule {}
