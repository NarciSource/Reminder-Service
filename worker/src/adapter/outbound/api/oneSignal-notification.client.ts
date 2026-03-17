import { Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: NestJS DI requires runtime class reference
import axios, { AxiosInstance } from "axios";

import { NotificationClient } from "@/application/port.out/api";
import type { ScheduleEntity } from "@/domain/model/schedule.entity";

/**
 * `OnesignalClient`를 사용하여 특정 사용자에게 푸시 알림을 전송합니다.
 */

@Injectable()
export default class OneSignalNotificationClient extends NotificationClient {
    private readonly instance: AxiosInstance;

    constructor() {
        super();

        /*
         * - `ONESIGNAL_API_URL`: OneSignal API의 기본 URL입니다.
         * - `ONESIGNAL_API_KEY`: 환경 변수에서 가져온 OneSignal API 키입니다.
         * - `ONESIGNAL_APP_ID`: 환경 변수에서 가져온 OneSignal 앱 ID입니다.
         */
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
     * 알림을 전송합니다.
     *
     * @param {ScheduleEntity} params - 알림에 필요한 이벤트 세부 정보
     * @returns {Promise<void>} 알림 전송 작업이 완료되면 반환됩니다.
     * @throws {Error} 알림 전송 중 오류가 발생하면 예외를 던집니다.
     */
    async postNotification({
        company: { name: companyName, location },
        date,
        position,
        category,
        description,
        clientId,
    }: ScheduleEntity): Promise<void> {
        try {
            const external_id = [clientId]; // 호출할 ID

            const response = await this.instance.post(null, {
                target_channel: "push",
                contents: {
                    en: `${companyName}\n${description}\n${location}\n${new Date(date).toLocaleTimeString()}\n${position} ${category}`,
                },
                include_aliases: {
                    external_id,
                },
            });

            console.log("Notification sent successfully:", response.data);
        } catch (error: any) {
            console.error("Error sending notification:", error.response?.data || error.message);
        }
    }
}
