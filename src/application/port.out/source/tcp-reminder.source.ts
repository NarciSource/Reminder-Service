import { Inject } from "@nestjs/common";

import { ReminderClient } from "@/application/port.out/api";
import { ReminderStatus } from "@/domain/model/reminder.entity";
import ReminderSource from "./reminder.source";

// 알림 조회 범위
const REMINDER_READ_RANGE = Number(process.env.READ_RANGE) || 1 * 60 * 1000; // 1분

export default class TcpReminderSource extends ReminderSource {
    constructor(
        @Inject(ReminderClient)
        private readonly reminderClient: ReminderClient,
    ) {
        super();
    }

    async getReady(now: Date) {
        const start_time = new Date(now.getTime() - REMINDER_READ_RANGE);

        // 마이크로서비스 연결 확인
        await this.reminderClient.ensureConnected();

        // 발송할 알림들
        const reminders = await this.reminderClient.readByOptions({
            start_time,
            end_time: now,
            status: ReminderStatus.Pending,
        });

        return reminders.map((reminder) => reminder.event_id);
    }
}
