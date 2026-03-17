import { Test, type TestingModule } from "@nestjs/testing";
import axios from "axios";

import type { ScheduleEntity } from "@/domain/model/schedule.entity";
import OneSignalNotificationClient from "./oneSignal-notification.client";

jest.mock("axios", () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
    },
}));

describe("OneSignalNotificationClient", () => {
    let mockPost: jest.Mock;
    let client: OneSignalNotificationClient;
    let schedule: ScheduleEntity;

    beforeEach(async () => {
        mockPost = jest.fn();

        (axios.create as jest.Mock).mockReturnValue({
            post: mockPost,
            interceptors: {
                request: {
                    use: jest.fn(),
                },
            },
        });

        const module: TestingModule = await Test.createTestingModule({
            providers: [OneSignalNotificationClient],
        }).compile();

        client = module.get<OneSignalNotificationClient>(OneSignalNotificationClient);

        schedule = {
            id: "67890",
            company: { name: "Test Company", location: "Test Location" },
            date: new Date(),
            position: "Developer",
            category: "Engineering",
            description: "Test Description",
            clientId: "12345",
        };
    });

    it("알림 성공", async () => {
        const response = { data: "success" };
        mockPost.mockResolvedValue(response);

        await client.postNotification(schedule);

        expect(mockPost).toHaveBeenCalledWith(null, {
            target_channel: "push",
            contents: {
                en: `${schedule.company.name}\n${schedule.description}\n${schedule.company.location}\n${new Date(schedule.date).toLocaleTimeString()}\n${schedule.position} ${schedule.category}`,
            },
            include_aliases: {
                external_id: [schedule.clientId],
            },
        });
    });

    it("알림 실패", async () => {
        const error = new Error("Failed to send notification");
        mockPost.mockRejectedValue(error);

        console.error = jest.fn();

        await client.postNotification(schedule);

        expect(console.error).toHaveBeenCalledWith("Error sending notification:", error.message);
    });
});
