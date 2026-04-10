import { Module } from "@nestjs/common";

import RedisLuaService from "./lua-service";
import RedisProvider, { REDIS_STORAGE } from "./provider";

@Module({
    providers: [RedisProvider, RedisLuaService],
    exports: [REDIS_STORAGE],
})
export default class RedisModule {}
