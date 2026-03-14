import type { NotificationStatus } from "@/domain/model/entity";

export default class ReplaceCommand {
    /**
     * @param event_id - 알림이 할당된 이벤트의 ID
     * @param send_at - 알림 발송 시간
     * @param status - 알림 상태
     */
    constructor(
        public readonly event_id: string,
        public readonly send_at: Date,
        public readonly status: NotificationStatus,
    ) {}
}
