import { Inject, Injectable } from "@nestjs/common";
import type Redis from "ioredis";

import { DelayQueue } from "@/application/port.out/messaging/delay-queue";
import { REDIS_STORAGE } from "@/infrastructure/persistence/redis";

@Injectable()
export default class RedisZSetDelayQueue extends DelayQueue {
    constructor(
        @Inject(REDIS_STORAGE)
        private readonly instance: Redis,
        private readonly key: string,
    ) {
        super();
    }

    async pollDue<T>(time: Date): Promise<T[]> {
        const items = await this.instance.zrangebyscore(this.key, 0, time.getTime());

        if (items.length === 0) return [];

        await this.instance.zrem(this.key, ...items);

        return items.map((item) => JSON.parse(item) as T);
    }
}
