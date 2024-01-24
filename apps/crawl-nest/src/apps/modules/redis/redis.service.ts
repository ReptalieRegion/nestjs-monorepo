import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { RedisStore } from 'cache-manager-redis-yet';

@Injectable()
export class RedisService {
    constructor(@Inject(CACHE_MANAGER) private readonly redisStore: RedisStore) {}

    async set(key: string, data: string, ttl?: number) {
        if (typeof key === 'string') {
            await this.redisStore.set(key, data, ttl);
        }
    }

    async get(key: string) {
        if (typeof key === 'string') {
            const result = await this.redisStore.get(key);
            return result;
        }
    }

    async del(key: string) {
        if (typeof key === 'string') {
            await this.redisStore.del(key);
        }
    }

    async mset(args: Array<[string, unknown]>, ttl?: number | undefined) {
        await this.redisStore.mset(args, ttl);
    }

    async mget(args: string[]) {
        await this.redisStore.mget(...args);
    }

    async mdel(args: string[]) {
        await this.redisStore.mdel(...args);
    }
}
