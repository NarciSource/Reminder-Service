import { Logger, type Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { type Job, Queue } from "bullmq";

export const BULLMQ_QUEUE = Symbol("bullmq-queue");

export type Processor<T> = (job: Job<T>) => Promise<void>;

export default {
    provide: BULLMQ_QUEUE,
    useFactory: (configService: ConfigService) => {
        const logger = new Logger("BullMQ");
        const host = configService.get<string>("REDIS_HOST", "localhost");
        const port = configService.get<number>("REDIS_PORT", 6379);

        logger.log(`BullMQ 서비스 ${host}:${port}에 연결`);

        return new Queue("reminder-delay-queue", {
            connection: { host, port },
        });
    },
    inject: [ConfigService],
} as Provider;
