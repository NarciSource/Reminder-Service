import { Inject, Injectable } from "@nestjs/common";

import type { DelayQueue } from "../messaging/delay-queue";
import { REMINDER_DELAY_QUEUE } from "../messaging/token";
import ReminderSource from "./reminder.source";

@Injectable()
export default class DelayQueueSource extends ReminderSource {
    constructor(
        @Inject(REMINDER_DELAY_QUEUE)
        private readonly delayQueue: DelayQueue,
    ) {
        super();
    }

    async getReady(now: Date) {
        const event_ids = await this.delayQueue.pollDue<string>(now);

        return event_ids;
    }
}
