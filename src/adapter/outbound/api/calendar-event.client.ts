import { Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: NestJS DI requires runtime class reference
import axios, { AxiosInstance } from "axios";

import { EventReceiver } from "@/application/port.out/api";
import type { ScheduleEntity } from "@/domain/model/schedule.entity";
import type { ResponseDTO } from "./dto";

/**
 * 캘린더에서 특정 이벤트 ID에 대한 상세 정보를 가져옵니다.
 */
@Injectable()
export default class CalendarEventClient extends EventReceiver {
    private readonly instance: AxiosInstance;

    constructor() {
        super();

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
     * 주어진 이벤트 ID를 사용하여 캘린더 API에서 이벤트 상세 정보를 가져옵니다.
     *
     * @param {Object} params - 이벤트 ID를 포함하는 객체
     * @param {string} params.event_id - 조회할 이벤트의 ID
     * @returns {Promise<ScheduleEntity>} 이벤트 상세 정보
     * @throws {Error} 이벤트 ID에 대한 상세 정보가 없거나 API 호출 실패 시 에러를 발생시킵니다.
     */
    async receive({ event_id }: { event_id: string }): Promise<ScheduleEntity> {
        const {
            status,
            data: { success, data: schedule },
        }: { status: number; data: ResponseDTO<ScheduleEntity> } = await this.instance.get<ResponseDTO<ScheduleEntity>>(
            `/${event_id}`,
        );

        if (status === 200) {
            if (success) {
                return schedule;
            } else {
                throw new Error("해당 이벤트 ID에 대한 상세 정보가 없습니다.");
            }
        } else {
            throw new Error("캘린더 API 호출 실패");
        }
    }
}
