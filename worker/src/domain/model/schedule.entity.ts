/**
 * 이벤트 세부 정보를 나타내는 인터페이스입니다.
 *
 * @interface ScheduleEntity
 * @property id - 인터뷰 세부 정보의 고유 식별자입니다.
 * @property company - 회사 정보를 포함하는 객체입니다.
 * @property company.name - 회사 이름입니다.
 * @property company.location - 회사 위치입니다.
 * @property date - 인터뷰가 예정된 시간입니다.
 * @property position - 지원하는 직책입니다.
 * @property category - 이벤트의 카테고리입니다.
 * @property description - 이벤트에 대한 설명입니다.
 * @property clientId - 클라이언트의 고유 식별자입니다.
 */
export interface ScheduleEntity {
    id: string;
    company: {
        name: string;
        location: string;
    };
    date: Date;
    position: string;
    category: string;
    description: string;
    clientId: string;
}
