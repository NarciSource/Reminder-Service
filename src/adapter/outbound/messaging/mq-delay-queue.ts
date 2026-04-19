import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import type { Queue } from "bullmq";

import type { DelayQueue } from "@/application/port.out/messaging";

@Injectable()
export default class MQDelayQueue implements DelayQueue {
    constructor(
        @InjectQueue("reminder-delay-queue")
        private readonly queue: Queue,
    ) {}

    async schedule<T>(payload: T, executeAt: Date): Promise<void> {
        const delay = Math.max(executeAt.getTime() - Date.now(), 0);

        await this.queue.add("dispatch", payload, {
            delay,
            jobId: payload.toString(),
            removeOnComplete: true,
        });
    }

    async reschedule<T>(payload: T, executeAt: Date): Promise<void> {
        await this.cancel(payload);

        await this.schedule(payload, executeAt);
    }

    async cancel<T>(payload: T): Promise<void> {
        const job = await this.queue.getJob(payload.toString());

        if (!job) return;

        await job.remove();
    }
}
