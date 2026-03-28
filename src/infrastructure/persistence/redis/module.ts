import { Module } from "@nestjs/common";

import RedisProvider, { REDIS_STORAGE } from "./provider";

@Module({
    providers: [RedisProvider],
    exports: [REDIS_STORAGE],
})
export default class RedisModule {}
