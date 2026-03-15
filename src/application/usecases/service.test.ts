import { Test, type TestingModule } from "@nestjs/testing";

import { type ReminderEntity, ReminderStatus } from "@/domain/model/reminder.entity";
import { NotificationClient, ReminderClient, ScheduleClient } from "../port.out/api";
import WorkerService from "./service";

describe("WorkerService", () => {
    let service: WorkerService;
    let reminderClient: ReminderClient;
    let notificationClient: NotificationClient;
    let scheduleClient: ScheduleClient;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WorkerService,
                {
                    provide: ReminderClient,
                    useValue: {
                        ensureConnected: jest.fn(),
                        readByOptions: jest.fn(),
                        updatePartial: jest.fn(),
                    },
                },
                {
                    provide: ScheduleClient,
                    useValue: {
                        getSchedule: jest.fn(),
                    },
                },
                {
                    provide: NotificationClient,
                    useValue: {
                        postNotification: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<WorkerService>(WorkerService);
        reminderClient = module.get<ReminderClient>(ReminderClient);
        scheduleClient = module.get<ScheduleClient>(ScheduleClient);
        notificationClient = module.get<NotificationClient>(NotificationClient);
    });

    it("서비스 정의", () => {
        expect(service).toBeDefined();
    });

    it("알림 처리", async () => {
        const mockReminders = [
            {
                event_id: "1",
                send_at: new Date(),
                status: ReminderStatus.Pending,
            } as ReminderEntity,
            {
                event_id: "2",
                send_at: new Date(),
                status: ReminderStatus.Pending,
            } as ReminderEntity,
        ];

        jest.spyOn(reminderClient, "ensureConnected").mockResolvedValue(Promise.resolve());
        jest.spyOn(reminderClient, "readByOptions").mockResolvedValue(mockReminders);
        jest.spyOn(notificationClient, "postNotification").mockImplementation(() => Promise.resolve());
        jest.spyOn(reminderClient, "updatePartial").mockImplementation((notification) =>
            Promise.resolve({ ...notification, send_at: new Date() } as ReminderEntity),
        );

        await service.start();

        expect(reminderClient.readByOptions).toHaveBeenCalledWith({
            start_time: expect.any(Date),
            end_time: expect.any(Date),
            status: ReminderStatus.Pending,
        });

        for (let i = 0; i < mockReminders.length; i++) {
            const expected = (scheduleClient.getSchedule as jest.Mock).mock.calls[i][0];

            expect(expected).toEqual(mockReminders[i]);
        }
    });
});
