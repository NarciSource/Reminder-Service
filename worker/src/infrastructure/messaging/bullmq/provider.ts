import { BullModule } from "@nestjs/bullmq";
import { Logger, type Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Job } from "bullmq";

export type Processor<T> = (job: Job<T>) => Promise<void>;

export default {
    useFactory: (configService: ConfigService) => {
        const logger = new Logger("BullMQ");
        const host = configService.get<string>("REDIS_HOST", "localhost");
        const port = configService.get<number>("REDIS_PORT", 6379);

        logger.log(`BullMQ 서비스 ${host}:${port}에 연결`);

        return BullModule.forRoot({
            connection: {
                host,
                port,
            },
        });
    },
    inject: [ConfigService],
} as Provider;
