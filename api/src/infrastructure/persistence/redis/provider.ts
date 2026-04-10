import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

export const REDIS_STORAGE = Symbol("redis-storage");

export default {
    provide: REDIS_STORAGE,
    useFactory: (configService: ConfigService) => {
        const logger = new Logger("RedisStorage");
        const host = configService.get<string>("REDIS_HOST", "localhost");
        const port = configService.get<number>("REDIS_PORT", 6379);

        const redis = new Redis({ host, port });
        redis.on("ready", () => logger.log(`${host}:${port}에 연결 완료`));
        redis.on("error", (error) => logger.error(`${host}:${port}에 연결 실패`, error));

        return redis;
    },
    inject: [ConfigService],
};
