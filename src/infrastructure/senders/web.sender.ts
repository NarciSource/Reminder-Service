import { Injectable } from "@nestjs/common";

import type { Schedule } from "@/application/dto";
import type { INotificationSender } from "@/application/ports";
// biome-ignore lint/style/useImportType: NestJS DI requires runtime class reference
import { OnesignalClient } from "../api/onesignal.client";

/**
 * 웹 알림을 전송하는 클래스입니다.
 *
 * `OnesignalClient`를 사용하여 특정 사용자에게 푸시 알림을 전송합니다.
 */

@Injectable()
export class WebNotificationSender implements INotificationSender {
    /**
     * WebNotificationSender 클래스의 생성자입니다.
     *
     * @param client - OnesignalClient 인스턴스. 알림을 전송하기 위해 사용됩니다.
     */
    constructor(private readonly client: OnesignalClient) {}

    /**
     * 알림을 전송합니다.
     *
     * @param {Schedule} params - 알림에 필요한 이벤트 세부 정보
     *
     * @returns {Promise<void>} 알림 전송 작업이 완료되면 반환됩니다.
     *
     * @throws {Error} 알림 전송 중 오류가 발생하면 예외를 던집니다.
     */
    async dispatch({
        company: { name: companyName, location },
        date,
        position,
        category,
        description,
        clientId,
    }: Schedule): Promise<void> {
        try {
            const external_id = [clientId]; // 호출할 ID

            const response = await this.client.post(null, {
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
