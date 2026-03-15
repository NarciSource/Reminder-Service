import { Injectable } from "@nestjs/common";
import axios, { type AxiosInstance } from "axios";

/**
 * 이 클래스는 OneSignal API와의 통신을 담당합니다.
 * Axios 인스턴스를 생성하고, 요청 인터셉터를 설정하여 OneSignal API 호출 시 필요한
 * 인증 헤더와 앱 ID를 자동으로 추가합니다.
 */
@Injectable()
export class OnesignalClient {
    /**
     * @private
     * @readonly
     * AxiosInstance를 나타내는 속성입니다.
     * 이 인스턴스는 외부 API와의 통신을 처리하는 데 사용됩니다.
     */
    private readonly instance: AxiosInstance;

    /**
     * OneSignal 클라이언트를 초기화하는 생성자입니다.
     *
     * - `ONESIGNAL_API_URL`: OneSignal API의 기본 URL입니다.
     * - `ONESIGNAL_API_KEY`: 환경 변수에서 가져온 OneSignal API 키입니다.
     * - `ONESIGNAL_APP_ID`: 환경 변수에서 가져온 OneSignal 앱 ID입니다.
     *
     * 이 생성자는 Axios 인스턴스를 생성하고, 요청 인터셉터를 설정하여
     * POST 또는 PUT 요청 시 `app_id`를 요청 데이터에 자동으로 추가합니다.
     */
    constructor() {
        const ONESIGNAL_API_URL = "https://api.onesignal.com/notifications";
        const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;
        const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;

        // Axios 인스턴스 생성
        this.instance = axios.create({
            baseURL: ONESIGNAL_API_URL,
            headers: {
                Authorization: ONESIGNAL_API_KEY,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        // 요청 인터셉터
        this.instance.interceptors.request.use((config) => {
            if (config.method === "post" || config.method === "put") {
                config.data = {
                    ...config.data,
                    app_id: ONESIGNAL_APP_ID, // 앱 ID 추가
                };
            }
            return config;
        });
    }

    /**
     * `post` 메서드를 반환합니다.
     *
     * 이 메서드는 내부적으로 설정된 Axios 인스턴스의 `post` 메서드에 접근할 수 있도록 합니다.
     *
     * @returns `instance.post` 메서드
     */
    get post(): AxiosInstance["post"] {
        return this.instance.post;
    }
}
