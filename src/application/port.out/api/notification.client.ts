import type { ScheduleEntity } from "@/domain/model/schedule.entity";

/**
 * 알림을 전송하는 추상 클래스입니다.
 */
export default abstract class NotificationClient {
    abstract postNotification(schedule: ScheduleEntity): Promise<void>;
}
