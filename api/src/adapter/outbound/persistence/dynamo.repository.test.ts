import { Test, type TestingModule } from "@nestjs/testing";
import type { ModelType } from "dynamoose/dist/General";

import ReminderEntity, { ReminderStatus } from "@/domain/model/entity";
import DynamoModel from "@/infrastructure/persistence/dynamo/model";
import DynamoRepository from "./dynamo.repository";

describe("DynamoRepository", () => {
    let repository: DynamoRepository;
    let model: jest.Mocked<ModelType<any>>;

    beforeEach(async () => {
        const mockModel = {
            update: jest.fn(),
            get: jest.fn(),
            query: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                using: jest.fn().mockReturnThis(),
                exec: jest.fn(),
            }),
            delete: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DynamoRepository,
                {
                    provide: DynamoModel,
                    useValue: {
                        getModel: jest.fn().mockReturnValue(mockModel),
                    },
                },
            ],
        }).compile();

        repository = module.get<DynamoRepository>(DynamoRepository);
        model = mockModel as unknown as jest.Mocked<ModelType<any>>;
    });

    describe("create", () => {
        it("알림 데이터를 생성", async () => {
            const eventData = new ReminderEntity("1", new Date(), ReminderStatus.Pending);
            const ttl = Math.floor(eventData.send_at.getTime() / 1000) + 60 * 60;

            model.update.mockResolvedValue(eventData);

            const result = await repository.create(eventData);

            expect(result).toEqual(eventData);
            expect(model.update).toHaveBeenCalledWith({
                ...eventData,
                ttl,
            });
        });
    });

    describe("findById", () => {
        it("ID로 알림 데이터를 조회", async () => {
            const event_id = "1";
            const entity = new ReminderEntity(event_id, new Date(), ReminderStatus.Pending);

            model.get.mockResolvedValue(entity);

            const result = await repository.findById(event_id);

            expect(result).toEqual(entity);
            expect(model.get).toHaveBeenCalledWith(event_id);
        });
    });

    describe("findBetween", () => {
        it("예약된 시간과 상태로 알림 데이터를 조회", async () => {
            const start_time = new Date();
            const end_time = new Date();
            const status = ReminderStatus.Pending;
            const entities = [new ReminderEntity("1", start_time, status)];

            model.query("send_at").exec.mockResolvedValue(entities);

            const result = await repository.findBetween(start_time, end_time, status);

            expect(result).toEqual(entities);
            expect(model.query).toHaveBeenCalledWith("send_at");
            expect(model.query("send_at").eq).toHaveBeenCalledWith(start_time.getTime());
            expect(model.query("send_at").where).toHaveBeenCalledWith("status");
            expect(model.query("send_at").eq).toHaveBeenCalledWith(status);
            expect(model.query("send_at").using).toHaveBeenCalledWith("send_at-status-index");
        });
    });

    describe("deleteById", () => {
        it("ID로 알림 데이터를 삭제", async () => {
            const event_id = "1";

            model.delete.mockResolvedValue(true);

            const result = await repository.deleteById(event_id);

            expect(result).toEqual(true);
            expect(model.delete).toHaveBeenCalledWith(event_id);
        });
    });
});
