export interface DelayQueue {
    /**
     * 지정된 시간에 작업을 예약합니다.
     * @param payload 작업에 필요한 데이터
     * @param executeAt 작업이 실행될 시간 (Unix 타임스탬프)
     */
    schedule<T>(payload: T, executeAt: Date): Promise<void>;

    /**
     * 이미 예약된 작업을 재예약합니다.
     * @param payload 작업에 필요한 데이터
     * @param executeAt 작업이 실행될 새로운 시간 (Unix 타임스탬프)
     */
    reschedule<T>(payload: T, executeAt: Date): Promise<void>;

    /**
     * 예약된 작업을 취소합니다.
     * @param payload 작업에 필요한 데이터
     */
    cancel<T>(payload: T): Promise<void>;
}

export const DelayQueue = Symbol("delay-queue");
