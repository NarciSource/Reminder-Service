import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";

import HealthCheckController from "./healthCheckController";

describe("HealthCheckController", () => {
    const request = require("supertest");

    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [TerminusModule],
            controllers: [HealthCheckController],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it("헬스체크", async () => {
        const response = await request(app.getHttpServer()).get("/health");
        const expectedResponse = {
            status: "ok",
        };

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining(expectedResponse));
    });
});
