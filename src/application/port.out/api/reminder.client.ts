import type { ReminderEntity } from "@/domain/model/reminder.entity";
import type { ParametersDTO } from "./dto";

/**
 * 마이크로서비스와의 통신을 담당하는 추상 클래스입니다.
 */
export default abstract class ReminderClient {
    protected isConnected = false;

    /**
     * 클라이언트가 연결되었는지 확인하고, 연결되지 않은 경우 연결을 보장합니다.
     *
     * @returns 연결이 보장된 후 완료되는 Promise 객체
     */
    abstract ensureConnected(): Promise<void>;

    /**
     * 주어진 쿼리 옵션에 따라 알림 엔티티를 조회합니다.
     *
     * @param query 조회에 필요한 매개변수를 포함하는 ParametersDTO 객체
     * @returns 조회된 ReminderEntity 배열을 포함하는 Promise 객체
     */
    abstract readByOptions(query: ParametersDTO): Promise<ReminderEntity[]>;

    /**
     * 주어진 쿼리와 이벤트 ID를 기반으로 알림 엔티티를 부분적으로 업데이트합니다.
     *
     * @param query 업데이트에 필요한 매개변수와 이벤트 ID를 포함하는 객체
     * @returns 업데이트된 ReminderEntity를 포함하는 Promise 객체
     */
    abstract updatePartial(query: ParametersDTO & { event_id: string }): Promise<ReminderEntity>;
}
