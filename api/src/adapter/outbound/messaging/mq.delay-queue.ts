import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import type { Queue } from "bullmq";

import type { ReminderDelayQueue } from "@/application/port.out/messaging";
import type ReminderEntity from "@/domain/model/entity";

@Injectable()
export default class MQDelayQueue implements ReminderDelayQueue {
    constructor(
        @InjectQueue("reminder-delay-queue")
        private readonly queue: Queue,
    ) {}

    async schedule(key: string, payload: ReminderEntity, executeAt: Date): Promise<void> {
        const delay = Math.max(executeAt.getTime() - Date.now(), 0);

        await this.queue.add("dispatch", payload, {
            delay,
            jobId: key,
            removeOnComplete: true,
        });
    }

    async reschedule(key: string, payload: ReminderEntity, executeAt: Date): Promise<void> {
        await this.cancel(key);

        await this.schedule(key, payload, executeAt);
    }

    async cancel(key: string): Promise<void> {
        const job = await this.queue.getJob(key);

        if (!job) return;

        await job.remove();
    }
}
