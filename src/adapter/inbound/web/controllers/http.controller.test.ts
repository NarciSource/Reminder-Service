import type { INestApplication } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Test, type TestingModule } from "@nestjs/testing";

import { NotificationStatus } from "@/domain/model/entity";
import type { CreateRequestDTO, ParametersDTO, UpdateRequestDTO } from "../dtos";
import HttpController from "./http.controller";

describe("HttpController", () => {
    const request = require("supertest");

    let app: INestApplication;
    let commandBus: jest.Mocked<CommandBus>;
    let queryBus: jest.Mocked<QueryBus>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [HttpController],
            providers: [
                {
                    provide: CommandBus,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
                {
                    provide: QueryBus,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        commandBus = moduleFixture.get(CommandBus);
        queryBus = moduleFixture.get(QueryBus);

        await app.init();
    });

    it("/POST create", async () => {
        const dto: CreateRequestDTO = {
            event_id: "1",
            send_at: new Date(),
            status: NotificationStatus.Pending,
        };
        const response = undefined;

        commandBus.execute.mockResolvedValue(response);

        await request(app.getHttpServer()).post("/").send(dto).expect(201);

        expect(commandBus.execute).toHaveBeenCalledWith(
            expect.objectContaining({
                ...dto,
                send_at: dto.send_at.toISOString(),
            }),
        );
    });

    it("/GET read", async () => {
        const response = undefined;

        queryBus.execute.mockResolvedValue(response);

        await request(app.getHttpServer()).get("/1").expect(200);
    });

    it("/GET list", async () => {
        const query: ParametersDTO = { status: NotificationStatus.Pending };
        const response = [];

        queryBus.execute.mockResolvedValue(response);

        await request(app.getHttpServer()).get("/").query(query).expect(200);
    });

    it("/PUT replace", async () => {
        const bodyDTO: CreateRequestDTO = {
            event_id: "1",
            send_at: new Date(),
            status: NotificationStatus.Pending,
        };
        const response = undefined;

        commandBus.execute.mockResolvedValue(response);

        await request(app.getHttpServer()).put("/1").send(bodyDTO).expect(200);

        expect(commandBus.execute).toHaveBeenCalledWith(
            expect.objectContaining({
                ...bodyDTO,
                send_at: bodyDTO.send_at.toISOString(),
            }),
        );
    });

    it("/PATCH update", async () => {
        const bodyDTO: UpdateRequestDTO = {
            status: NotificationStatus.Sent,
            event_id: "1",
        };
        const response = undefined;
        commandBus.execute.mockResolvedValue(response);

        await request(app.getHttpServer()).patch("/1").send(bodyDTO).expect(200);

        expect(commandBus.execute).toHaveBeenCalledWith(expect.objectContaining(bodyDTO));
    });

    it("/DELETE delete", async () => {
        const response = undefined;

        commandBus.execute.mockResolvedValue(response);

        await request(app.getHttpServer()).delete("/1").expect(200);
    });

    afterAll(async () => {
        await app.close();
    });
});
