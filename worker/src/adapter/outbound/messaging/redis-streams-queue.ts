import { Inject, Injectable } from "@nestjs/common";
import type Redis from "ioredis";

import { type StreamMessage, StreamsQueue } from "@/application/port.out/messaging/streams-queue";
import { REDIS_STORAGE } from "@/infrastructure/persistence/redis";

type XReadGroupArgs = Parameters<Redis["xreadgroup"]>;
type XReadGroupResult = Array<[stream: string, entries: [id: string, fields: Record<string, string>][]]>;

@Injectable()
export default class RedisStreamQueue extends StreamsQueue {
    constructor(
        @Inject(REDIS_STORAGE)
        private readonly redis: Redis,
        private readonly key: string,
    ) {
        super();
    }

    async push<T>(payload: T): Promise<void> {
        await this.redis.xadd(this.key, "*", "payload", JSON.stringify(payload));
    }

    async *consume<T>(): AsyncGenerator<StreamMessage<T>> {
        while (true) {
            const xReadGroupArgs = [
                ["GROUP", "g1", "c1"], // 그룹
                ["BLOCK", 0], // 무한 대기
                ["STREAMS", this.key, ">"], // 미처리 메시지
            ];

            const streams = (await this.redis.xreadgroup(
                ...(xReadGroupArgs.flat() as XReadGroupArgs),
            )) as XReadGroupResult | null;
            if (!streams) continue;

            for (const [, messages] of streams) {
                for (const [id, fields] of messages) {
                    yield {
                        payload: JSON.parse(fields.payload) as T,
                        ack: async () => {
                            await this.redis.xack(this.key, "g1", id);
                        },
                    };
                }
            }
        }
    }
}
