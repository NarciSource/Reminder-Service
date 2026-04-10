import { Module } from "@nestjs/common";

import RedisProvider from "./provider";

@Module({
    providers: [RedisProvider],
    exports: [RedisProvider],
})
export default class RedisModule {}
