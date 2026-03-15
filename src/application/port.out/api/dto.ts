import type { ReminderStatus } from "@/domain/model/reminder.entity";

/**
 * 알림 서비스의 매개변수를 정의하는 데이터 전송 객체입니다.
 *
 * @property start_time - 알림의 시작 시간을 나타내는 선택적 `Date` 객체입니다.
 * @property end_time - 알림의 종료 시간을 나타내는 선택적 `Date` 객체입니다.
 * @property status - 알림의 상태를 나타내는 선택적 `ReminderStatus` 값입니다.
 */
export interface ParametersDTO {
    start_time?: Date;
    end_time?: Date;
    status?: ReminderStatus;
}
