import { Test, TestingModule } from "@nestjs/testing";

import { Schedule } from "application/dto";

import { CalendarEventReceiver } from "./calendarReceiver";
import { CalendarClient } from "../api";

describe("CalendarEventReceiver", () => {
    let receiver: CalendarEventReceiver;
    let client: CalendarClient;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CalendarEventReceiver,
                {
                    provide: CalendarClient,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        receiver = module.get<CalendarEventReceiver>(CalendarEventReceiver);
        client = module.get<CalendarClient>(CalendarClient);
    });

    it("이벤트 세부 정보를 반환", async () => {
        const schedule: Schedule = {
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
        (client.get as jest.Mock).mockResolvedValue({ status: 200, data: { success: true, data: schedule } });

        const result = await receiver.receive({ event_id: "test-event-id" });

        expect(result).toEqual(schedule);
        expect(client.get).toHaveBeenCalledWith("/test-event-id");
    });

    it("세부 정보가 없는 경우 오류", async () => {
        (client.get as jest.Mock).mockResolvedValue({ status: 200, data: { success: false, data: null } });

        await expect(receiver.receive({ event_id: "test-event-id" })).rejects.toThrow(
            "해당 이벤트 ID에 대한 상세 정보가 없습니다.",
        );
        expect(client.get).toHaveBeenCalledWith("/test-event-id");
    });

    it("호출 실패", async () => {
        (client.get as jest.Mock).mockResolvedValue({ status: 500, data: { success: false, data: null } });

        await expect(receiver.receive({ event_id: "test-event-id" })).rejects.toThrow(
            "캘린더 API 호출 실패",
        );
        expect(client.get).toHaveBeenCalledWith("/test-event-id");
    });
});
