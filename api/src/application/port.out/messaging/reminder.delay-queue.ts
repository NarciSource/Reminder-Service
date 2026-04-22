import type ReminderEntity from "@/domain/model/entity";

export default abstract class ReminderDelayQueue {
    /**
     * 지정된 시간에 작업을 예약합니다.
     * @param payload 작업에 필요한 데이터
     * @param executeAt 작업이 실행될 시간 (Unix 타임스탬프)
     */
    abstract schedule(key: string, payload: ReminderEntity, executeAt: Date): Promise<void>;

    /**
     * 이미 예약된 작업을 재예약합니다.
     * @param payload 작업에 필요한 데이터
     * @param executeAt 작업이 실행될 새로운 시간 (Unix 타임스탬프)
     */
    abstract reschedule(key: string, payload: ReminderEntity, executeAt: Date): Promise<void>;

    /**
     * 예약된 작업을 취소합니다.
     * @param payload 작업에 필요한 데이터
     */
    abstract cancel(key: string): Promise<void>;
}
