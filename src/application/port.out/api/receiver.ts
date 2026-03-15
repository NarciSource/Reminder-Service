import type { ScheduleEntity } from "@/domain/model/schedule.entity";

/**
 * 이벤트 수신을 처리하기 위한 추상 클래스입니다.
 */
export default abstract class EventReceiver {
    abstract receive({ event_id }: { event_id: string }): Promise<ScheduleEntity>;
}
