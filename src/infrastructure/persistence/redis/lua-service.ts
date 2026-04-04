import { Inject, Injectable } from "@nestjs/common";
import type Redis from "ioredis";

import { REDIS_STORAGE } from "@/infrastructure/persistence/redis";
import pollDueLua from "./lua/pollDue.lua";

@Injectable()
export default class RedisLuaService {
    constructor(
        @Inject(REDIS_STORAGE)
        private readonly redis: Redis,
    ) {}

    onModuleInit() {
        this.redis.defineCommand("pollDue", {
            numberOfKeys: 1,
            lua: pollDueLua,
        });
    }
}
