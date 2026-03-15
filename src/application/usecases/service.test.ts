import { Test, type TestingModule } from "@nestjs/testing";

import { type NotificationEntity, NotificationStatus } from "../dto";
import type { IEventReceiver, INotificationSender, IWorkerClient } from "../ports";
import WorkerService from "./service";

describe("WorkerService", () => {
    let service: WorkerService;
    let client: IWorkerClient;
    let sender: INotificationSender;
    let receiver: IEventReceiver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WorkerService,
                {
                    provide: "IWorkerClient",
                    useValue: {
                        ensureConnected: jest.fn(),
                        readByOptions: jest.fn(),
                        updatePartial: jest.fn(),
                    },
                },
                {
                    provide: "INotificationSender",
                    useValue: {
                        dispatch: jest.fn(),
                    },
                },
                {
                    provide: "IEventReceiver",
                    useValue: {
                        receive: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<WorkerService>(WorkerService);
        client = module.get<IWorkerClient>("IWorkerClient");
        sender = module.get<INotificationSender>("INotificationSender");
        receiver = module.get<IEventReceiver>("IEventReceiver");
    });

    it("서비스 정의", () => {
        expect(service).toBeDefined();
    });

    it("알림 처리", async () => {
        const mockNotifications = [
            {
                event_id: "1",
                send_at: new Date(),
                status: NotificationStatus.Pending,
            } as NotificationEntity,
            {
                event_id: "2",
                send_at: new Date(),
                status: NotificationStatus.Pending,
            } as NotificationEntity,
        ];

        jest.spyOn(client, "ensureConnected").mockResolvedValue(Promise.resolve());
        jest.spyOn(client, "readByOptions").mockResolvedValue(mockNotifications);
        jest.spyOn(sender, "dispatch").mockImplementation(() => Promise.resolve());
        jest.spyOn(client, "updatePartial").mockImplementation((notification) =>
            Promise.resolve({ ...notification, send_at: new Date() } as NotificationEntity),
        );

        await service.start();

        expect(client.readByOptions).toHaveBeenCalledWith({
            start_time: expect.any(Date),
            end_time: expect.any(Date),
            status: NotificationStatus.Pending,
        });

        for (let i = 0; i < mockNotifications.length; i++) {
            const expected = (receiver.receive as jest.Mock).mock.calls[i][0];

            expect(expected).toEqual(mockNotifications[i]);
        }
    });
});
