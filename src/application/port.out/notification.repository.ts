import type NotificationEntity from "@/domain/model/entity";
import type { NotificationStatus } from "@/domain/model/entity";

/**
 * 알림 저장소 인터페이스입니다. 알림 데이터를 생성, 조회, 삭제하는 메서드를 정의합니다.
 */
export interface NotificationRepository {
    /**
     * 새로운 알림 엔티티를 생성합니다.
     *
     * @param entity - 생성할 알림 엔티티
     * @returns 생성된 알림 엔티티
     */
    create(entity: NotificationEntity): Promise<NotificationEntity>;

    /**
     * 주어진 이벤트 ID를 기반으로 알림 데이터를 완전히 대체합니다.
     * @param event_id 대체할 알림 데이터의 이벤트 ID
     * @param entity 대체할 알림 데이터
     * @returns 대체된 알림 데이터
     */
    replace(event_id: string, entity: NotificationEntity): Promise<NotificationEntity>;

    /**
     * 주어진 이벤트 ID를 기반으로 알림 데이터를 업데이트합니다.
     * @param event_id 업데이트할 알림 데이터의 이벤트 ID
     * @param entity 업데이트할 알림 데이터의 부분적인 정보
     * @returns 업데이트된 알림 데이터
     */
    update(event_id: string, entity: Partial<NotificationEntity>): Promise<NotificationEntity>;

    /**
     * 주어진 이벤트 ID를 기반으로 알림 엔티티를 조회합니다.
     *
     * @param event_id - 조회할 알림의 이벤트 ID
     * @returns 조회된 알림 엔티티
     */
    findById(event_id: string): Promise<NotificationEntity>;

    /**
     * 예약 시간 범위와 상태를 기준으로 알림 엔티티 목록을 조회합니다.
     *
     * @param start_time - 조회할 시작 시간
     * @param end_time - 조회할 종료 시간
     * @param status - 조회할 알림 상태
     * @returns 조건에 맞는 알림 엔티티 배열을 반환합니다.
     */
    findBetween(start_time: Date, end_time: Date, status: NotificationStatus): Promise<NotificationEntity[]>;

    /**
     * 주어진 이벤트 ID를 기반으로 알림 엔티티를 삭제합니다.
     *
     * @param event_id - 삭제할 알림의 이벤트 ID
     * @returns 삭제 성공 여부
     */
    deleteById(event_id: string): Promise<boolean>;
}

export const NotificationRepository = Symbol("NotificationRepository");
