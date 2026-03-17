import { Inject } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { ReminderStatus } from "@/domain/model/reminder.entity";
import { NotificationClient, ReminderClient, ScheduleClient } from "../port.out/api";
import SendEvent from "./send.event";

@EventsHandler(SendEvent)
export default class SendHandler {
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

    async handle({ event_id }: SendEvent) {
        // 알림 내용 조회
        const schedule = await this.scheduleClient.getSchedule({ event_id });

        // 발송 처리
        await this.notificationClient.postNotification(schedule);
        console.log("발송 완료");

        // 발송 완료 처리
        await this.reminderClient.ensureConnected();
        await this.reminderClient.updatePartial({
            event_id,
            status: ReminderStatus.Sent,
        });
    }
}
