import { Logger, type Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { type Job, Worker } from "bullmq";

export const BULLMQ_WORKER = Symbol("bullmq-worker");

export type Processor<T> = (job: Job<T>) => Promise<void>;

export default {
    provide: BULLMQ_WORKER,
    useFactory: (configService: ConfigService) => {
        const logger = new Logger("BullMQ");
        const host = configService.get<string>("REDIS_HOST", "localhost");
        const port = configService.get<number>("REDIS_PORT", 6379);

        logger.log(`BullMQ 서비스 ${host}:${port}에 연결`);

        return <T>(queueName: string, processor: Processor<T>) =>
            new Worker(queueName, processor, {
                connection: { host, port },
                concurrency: 10, // 동시에 처리할 job 개수
                autorun: false, // 생성 즉시 실행
            });
    },
    inject: [ConfigService],
} as Provider;
