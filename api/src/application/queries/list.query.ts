import type { ReminderStatus } from "@/domain/model/entity";

export default class ListQuery {
    /**
     * @param [start_time] - 검색할 알림의 시작 시간 (선택적)
     * @param [end_time] - 검색할 알림의 종료 시간 (선택적)
     * @param [status] - 검색할 알림의 상태 (선택적)
     */
    constructor(
        public readonly start_time?: Date,
        public readonly end_time?: Date,
        public readonly status?: ReminderStatus,
    ) {}
}
