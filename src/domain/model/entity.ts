/**
 * 알림 상태를 나타내는 열거형입니다.
 *
 * - `Pending`: 알림이 아직 처리되지 않은 상태입니다.
 * - `Sent`: 알림이 성공적으로 전송된 상태입니다.
 * - `Failed`: 알림 전송이 실패한 상태입니다.
 */
export enum ReminderStatus {
    Pending = "Pending",
    Sent = "Sent",
    Failed = "Failed",
}

/**
 * ReminderEntity 클래스는 알림 정보를 나타냅니다.
 *
 * @property event_id - 알림이 할당된 이벤트의 ID
 * @property send_at - 알림 발송 시간
 * @property status - 알림 상태 (기본값: ReminderStatus.Pending)
 */
export default class ReminderEntity {
    constructor(
        public event_id: string, // 알림 할당한 이벤트 ID
        public send_at: Date, // 알림 발송 시간
        public status: ReminderStatus = ReminderStatus.Pending, // 알림 상태
    ) {}
}
