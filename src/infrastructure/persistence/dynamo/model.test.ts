import { Test, type TestingModule } from "@nestjs/testing";
import type dynamoose from "dynamoose";

import { NotificationStatus } from "@/domain/model/entity";
import DynamoModel from "./model";
import { DYNAMO_STORAGE } from "./provider";

describe("DynamoModel", () => {
    let model: DynamoModel;
    let mockDynamoose: jest.Mocked<typeof dynamoose>;

    beforeEach(async () => {
        mockDynamoose = {
            Schema: jest.fn(),
            model: jest.fn(),
        } as unknown as jest.Mocked<typeof dynamoose>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DynamoModel,
                {
                    provide: DYNAMO_STORAGE,
                    useValue: mockDynamoose,
                },
            ],
        }).compile();

        model = module.get<DynamoModel>(DynamoModel);
    });

    describe("constructor", () => {
        it("Dynamoose Schema와 모델을 생성", () => {
            expect(mockDynamoose.Schema).toHaveBeenCalledWith({
                event_id: { type: String, hashKey: true },
                send_at: {
                    type: Date,
                    index: {
                        type: "global",
                        name: "send_at-status-index",
                        rangeKey: "status",
                    },
                },
                status: {
                    type: String,
                    enum: Object.values(NotificationStatus),
                },
            });

            expect(mockDynamoose.model).toHaveBeenCalledWith("PickMe-Reminder", expect.any(mockDynamoose.Schema));
        });
    });

    describe("getModel", () => {
        it("Dynamoose 모델 인스턴스를 반환", () => {
            const result = model.getModel();

            expect(result).toBe(mockDynamoose.model.mock.results[0].value);
        });
    });
});
