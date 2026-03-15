import type { ScheduleEntity } from "@/domain/model/schedule.entity";

/**
 * 알림을 전송하는 추상 클래스입니다.
 */
export default abstract class NotificationSender {
    abstract dispatch(notification: ScheduleEntity): Promise<void>;
}
