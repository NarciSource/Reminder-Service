import { Test, type TestingModule } from "@nestjs/testing";
import axios from "axios";

import type { ScheduleEntity } from "@/domain/model/schedule.entity";
import CalendarEventClient from "./calendar-event.client";

jest.mock("axios", () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
    },
}));

describe("CalendarEventClient", () => {
    let mockGet: jest.Mock;
    let client: CalendarEventClient;

    beforeEach(async () => {
        mockGet = jest.fn();

        (axios.create as jest.Mock).mockReturnValue({
            get: mockGet,
            interceptors: {
                request: {
                    use: jest.fn(),
                },
            },
        });

        process.env.SCHEDULE_API_URL = "http://schedule-service";

        const module: TestingModule = await Test.createTestingModule({
            providers: [CalendarEventClient],
        }).compile();

        client = module.get<CalendarEventClient>(CalendarEventClient);
    });

    it("이벤트 세부 정보를 반환", async () => {
        const schedule: ScheduleEntity = {
            id: "mock-id",
            company: {
                name: "mock-company",
                location: "mock-location",
            },
            date: new Date(),
            position: "mock-position",
            category: "mock-category",
            description: "mock-description",
            clientId: "mock-client-id",
        };

        const mockResponse = {
            status: 200,
            data: {
                success: true,
                data: schedule,
            },
        };

        mockGet.mockResolvedValue(mockResponse);

        const result = await client.receive({ event_id: "test-event-id" });

        expect(result).toEqual(schedule);
        expect(mockGet).toHaveBeenCalledWith("/test-event-id");
    });

    it("세부 정보가 없는 경우 오류", async () => {
        mockGet.mockResolvedValue({ status: 200, data: { success: false, data: null } });

        await expect(client.receive({ event_id: "test-event-id" })).rejects.toThrow(
            "해당 이벤트 ID에 대한 상세 정보가 없습니다.",
        );
        expect(mockGet).toHaveBeenCalledWith("/test-event-id");
    });

    it("호출 실패", async () => {
        mockGet.mockResolvedValue({ status: 500, data: { success: false, data: null } });

        await expect(client.receive({ event_id: "test-event-id" })).rejects.toThrow("캘린더 API 호출 실패");
        expect(mockGet).toHaveBeenCalledWith("/test-event-id");
    });
});
