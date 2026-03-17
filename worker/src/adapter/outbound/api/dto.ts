/**
 * 응답 객체입니다.
 *
 * @property success - 성공 여부
 * @property message - 응답 메시지
 * @property data - 응답 데이터
 */
export interface ResponseDTO<T> {
    success: boolean;
    message: string;
    data: T;
}
