import type { NotificationEntity, ParametersDTO } from "../dto";

/**
 * IWorkerClient 인터페이스는 Worker 클라이언트와의 상호작용을 정의합니다.
 */
export interface IWorkerClient {
    /**
     * 클라이언트가 연결되었는지 확인하고, 연결되지 않은 경우 연결을 보장합니다.
     *
     * @returns 연결이 보장된 후 완료되는 Promise 객체
     */
    ensureConnected(): Promise<void>;

    /**
     * 주어진 쿼리 옵션에 따라 알림 엔티티를 조회합니다.
     *
     * @param query 조회에 필요한 매개변수를 포함하는 ParametersDTO 객체
     * @returns 조회된 NotificationEntity 배열을 포함하는 Promise 객체
     */
    readByOptions(query: ParametersDTO): Promise<NotificationEntity[]>;

    /**
     * 주어진 쿼리와 이벤트 ID를 기반으로 알림 엔티티를 부분적으로 업데이트합니다.
     *
     * @param query 업데이트에 필요한 매개변수와 이벤트 ID를 포함하는 객체
     * @returns 업데이트된 NotificationEntity를 포함하는 Promise 객체
     */
    updatePartial(query: ParametersDTO & { event_id: string }): Promise<NotificationEntity>;
}
