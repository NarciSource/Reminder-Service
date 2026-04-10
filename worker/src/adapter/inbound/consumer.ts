import { Inject, Injectable, type OnModuleInit } from "@nestjs/common";
import type { EventBus } from "@nestjs/cqrs";

import { SendEvent } from "@/application/events";
import type { StreamsQueue } from "@/application/port.out/messaging/streams-queue";
import { REMINDER_STREAMS_QUEUE } from "@/application/port.out/messaging/token";

@Injectable()
export class StreamConsumer implements OnModuleInit {
    constructor(
        private readonly eventBus: EventBus,
        @Inject(REMINDER_STREAMS_QUEUE)
        private readonly streamsQueue: StreamsQueue,
    ) {}

    async onModuleInit() {
        for await (const { payload, ack } of this.streamsQueue.consume<string>()) {
            try {
                const event = new SendEvent(payload);
                await this.eventBus.publish(event);

                await ack();
            } catch (e) {
                // retry
            }
        }
    }
}
