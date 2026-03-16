import { Inject, Injectable } from "@nestjs/common";
import type { EventBus } from "@nestjs/cqrs";

import { ReminderStatus } from "@/domain/model/reminder.entity";
import { SendEvent } from "../events";
import { ReminderClient } from "../port.out/api";

// 알림 조회 범위
const REMINDER_READ_RANGE = Number(process.env.READ_RANGE) || 60 * 60 * 1000; // 1시간

/**
 * WorkerService 클래스는 알림 발송 작업을 처리하는 서비스입니다.
 *
 * 이 클래스는 마이크로서비스와의 연결을 확인하고, 특정 시간 범위 내에서
 * 발송 대기 상태인 알림을 조회한 후, 알림을 발송하고 상태를 업데이트하는 역할을 수행합니다.
 */
@Injectable()
export default class WorkerService {
    constructor(
        private readonly eventBus: EventBus,
        @Inject(ReminderClient)
        private readonly reminderClient: ReminderClient,
    ) {}

    /**
     * 알림 발송 작업을 시작합니다. 특정 시간 범위 내에서 발송 대기 상태인 알림을 조회하고,
     * 각 알림을 발송한 후 상태를 업데이트합니다.
     *
     * @throws {Error} 발송 처리 중 에러가 발생할 경우 에러를 로깅합니다.
     */
    async start() {
        const start_time = new Date();
        const end_time = new Date(start_time.getTime() + REMINDER_READ_RANGE);

        // 마이크로서비스 연결 확인
        await this.reminderClient.ensureConnected();

        // 발송할 알림들
        const reminders = await this.reminderClient.readByOptions({
            start_time,
            end_time,
            status: ReminderStatus.Pending,
        });
        const event_ids = reminders.map((reminder) => reminder.event_id);

        for (const event_id of event_ids) {
            try {
                const event = new SendEvent(event_id);

                this.eventBus.publish(event);
            } catch (error) {
                console.error("발송 처리 중 에러 발생", error);
            }
        }
    }
}
