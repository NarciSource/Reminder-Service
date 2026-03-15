import { Inject, Injectable } from "@nestjs/common";

import { ReminderStatus } from "@/domain/model/reminder.entity";
import { NotificationClient, ReminderClient, ScheduleClient } from "../port.out/api";

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
    /**
     * @param reminderClient - 작업자 클라이언트 인터페이스를 구현한 객체. 작업자와의 통신을 처리합니다.
     * @param scheduleClient - 이벤트 수신 인터페이스를 구현한 객체. 외부 이벤트를 수신하고 처리합니다.
     * @param notificationClient - 알림 전송 인터페이스를 구현한 객체. 알림 전송 로직을 처리합니다.
     */
    constructor(
        @Inject(ReminderClient) private readonly reminderClient: ReminderClient,
        @Inject(ScheduleClient) private readonly scheduleClient: ScheduleClient,
        @Inject(NotificationClient) private readonly notificationClient: NotificationClient,
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

        for (const reminder of reminders) {
            try {
                // 알림 내용 조회
                const schedule = await this.scheduleClient.getSchedule(reminder);

                // 발송 처리
                this.notificationClient.postNotification(schedule);
                console.log("발송 완료");

                // 발송 완료 처리
                const { id: event_id } = schedule;

                await this.reminderClient.updatePartial({
                    event_id,
                    status: ReminderStatus.Sent,
                });
            } catch (error) {
                console.error("발송 처리 중 에러 발생", error);
            }
        }
    }
}
