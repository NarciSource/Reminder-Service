import { Inject, Injectable } from "@nestjs/common";

import { DelayQueue } from "../messaging/delay-queue";
import ReminderSource from "./reminder.source";

@Injectable()
export default class DelayQueueSource extends ReminderSource {
    constructor(
        @Inject(DelayQueue)
        private readonly delayQueue: DelayQueue,
    ) {
        super();
    }

    async getReady(now: Date) {
        const event_ids = await this.delayQueue.pollDue<string>(now);

        return event_ids;
    }
}
