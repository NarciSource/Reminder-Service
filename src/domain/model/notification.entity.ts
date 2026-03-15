/**
 * 알림 상태를 나타내는 열거형입니다.
 *
 * - `Pending`: 알림이 아직 전송되지 않은 상태.
 * - `Sent`: 알림이 성공적으로 전송된 상태.
 * - `Failed`: 알림 전송이 실패한 상태.
 */
export enum NotificationStatus {
    Pending = "Pending",
    Sent = "Sent",
    Failed = "Failed",
}

/**
 * 알림 엔티티를 나타내는 인터페이스입니다.
 *
 * @property event_id 알림이 할당된 이벤트의 ID입니다.
 * @property send_at 알림 발송 시간입니다.
 * @property status 알림의 상태를 나타냅니다.
 */
export interface NotificationEntity {
    event_id: string;
    send_at: Date;
    status: NotificationStatus;
}
