import { Injectable } from "@nestjs/common";
import axios, { type AxiosInstance } from "axios";

/**
 * 이 클래스는 캘린더 API와의 통신을 담당하는 클라이언트입니다.
 * Axios 인스턴스를 생성하여 API 요청을 처리합니다.
 */
@Injectable()
export class CalendarClient {
    /**
     * @private
     * @readonly
     * AxiosInstance를 나타내는 속성입니다.
     * 이 인스턴스는 외부 API와의 통신을 처리하는 데 사용됩니다.
     */
    private readonly instance: AxiosInstance;

    /**
     * CalendarClient 클래스의 생성자입니다.
     *
     * 이 생성자는 Axios 인스턴스를 생성하여 캘린더 API와의 통신을 설정합니다.
     * `SCHEDULE_API_URL` 환경 변수를 기반으로 기본 URL을 설정하며,
     * 요청 헤더는 JSON 형식의 데이터를 수락하고 전송하도록 구성됩니다.
     *
     * @throws {Error} `SCHEDULE_API_URL` 환경 변수가 설정되지 않은 경우 오류가 발생할 수 있습니다.
     */
    constructor() {
        const SCHEDULE_API_URL = process.env.SCHEDULE_API_URL;

        this.instance = axios.create({
            baseURL: SCHEDULE_API_URL,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
    }

    /**
     * `get` 메서드를 반환합니다.
     *
     * @remarks
     * 이 접근자는 캘린더 클라이언트의 내부 `instance` 객체에 정의된 `get` 메서드에
     * 간편하게 접근할 수 있도록 제공합니다.
     *
     * @returns `instance.get` 메서드
     */
    get get(): AxiosInstance["get"] {
        return this.instance.get;
    }
}
