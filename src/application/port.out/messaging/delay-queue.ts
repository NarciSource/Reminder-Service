export abstract class DelayQueue {
    /**
     * 예약된 작업 중 실행 시간이 지난 작업들을 가져옵니다.
     * @param time 시간 값
     * @returns 실행 시간이 지난 작업들의 데이터 배열
     */
    abstract pollDue<T>(time: Date): Promise<T[]>;
}
