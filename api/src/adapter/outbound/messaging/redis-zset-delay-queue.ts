import { Inject, Injectable } from "@nestjs/common";
import type Redis from "ioredis";

import type { DelayQueue } from "@/application/port.out/messaging/delay-queue";
import { REDIS_STORAGE } from "@/infrastructure/persistence/redis/provider";

@Injectable()
export default class RedisZSetDelayQueue implements DelayQueue {
    constructor(
        @Inject(REDIS_STORAGE)
        private readonly instance: Redis,
        private readonly key: string,
    ) {}

    async schedule<T>(payload: T, executeAt: Date): Promise<void> {
        await this.instance.zadd(this.key, executeAt.getTime(), JSON.stringify(payload));
    }

    async reschedule<T>(payload: T, executeAt: Date): Promise<void> {
        await this.instance.zadd(this.key, executeAt.getTime(), JSON.stringify(payload));
    }

    async cancel<T>(payload: T): Promise<void> {
        await this.instance.zrem(this.key, JSON.stringify(payload));
    }
}
