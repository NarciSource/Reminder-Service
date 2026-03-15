import type { INestApplication } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { of } from "rxjs";

import type { WorkerClientImpl } from "../src/infrastructure/worker.client";
import { WorkerModule } from "../src/module";

jest.mock("@nestjs/microservices", () => ({
    ClientTCP: jest.fn().mockImplementation(() => ({
        connect: jest.fn().mockResolvedValue(undefined),
        send: jest.fn().mockReturnValue({
            toPromise: jest.fn().mockResolvedValue({ data: "mockData" }),
        }),
        close: jest.fn(),
    })),
}));

describe("WorkerClientImpl E2E Test", () => {
    let app: INestApplication;
    let workerClient: WorkerClientImpl;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [WorkerModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        workerClient = moduleFixture.get<WorkerClientImpl>("IWorkerClient");

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it("WorkerClientImpl의 readByOptions 메서드를 호출", async () => {
        const query = { key: "value" };
        const mockResponse = { data: "mockData" };

        // send 메서드가 Observable을 반환하도록 설정
        jest.spyOn(workerClient["client"], "send").mockReturnValue(of(mockResponse));

        const result = await workerClient.readByOptions(query);

        expect(workerClient["client"].send).toHaveBeenCalledWith({ cmd: "readByOptions" }, query);
        expect(result).toEqual(mockResponse);
    });

    it("WorkerClientImpl의 updatePartial 메서드를 호출", async () => {
        const query = { key: "value" };
        const mockResponse = { data: "mockData" };

        jest.spyOn(workerClient["client"], "send").mockReturnValue(of(mockResponse));

        const result = await workerClient.updatePartial(query);

        expect(workerClient["client"].send).toHaveBeenCalledWith({ cmd: "updatePartial" }, query);
        expect(result).toEqual(mockResponse);
    });
});
