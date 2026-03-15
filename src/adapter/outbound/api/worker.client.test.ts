import type { ClientTCP } from "@nestjs/microservices";
import { Test, type TestingModule } from "@nestjs/testing";

import TcpWorkerClient from "./worker.client";

jest.mock("@nestjs/microservices", () => ({
    ClientTCP: jest.fn().mockImplementation(() => ({
        connect: jest.fn(),
        send: jest.fn(),
        handleError: jest.fn(),
    })),
}));

describe("WorkerClient", () => {
    let client: TcpWorkerClient;
    let tcpClientMock: jest.Mocked<ClientTCP>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TcpWorkerClient],
        }).compile();

        client = module.get<TcpWorkerClient>(TcpWorkerClient);
        tcpClientMock = client["client"] as jest.Mocked<ClientTCP>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("handleError가 트리거될 때 오류를 로깅", () => {
            const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
            const error = new Error("Test error");

            tcpClientMock.handleError(error);

            expect(consoleErrorSpy).toHaveBeenCalledWith("Connection error", error);
            expect(client["isConnected"]).toBe(false);

            consoleErrorSpy.mockRestore();
        });
    });

    describe("ensureConnected", () => {
        it("연결되지 않은 경우 재연결을 시도", async () => {
            jest.useFakeTimers();
            const connectClientSpy = jest.spyOn(client, "connectClient").mockResolvedValue(true);

            const promise = client.ensureConnected();
            jest.advanceTimersByTime(1000 * 60 * 10);
            await promise;

            expect(connectClientSpy).toHaveBeenCalled();

            jest.useRealTimers();
        });
    });

    describe("connectClient", () => {
        it("연결 시도", async () => {
            tcpClientMock.connect.mockResolvedValueOnce(undefined);

            const result = await client.connectClient();

            expect(tcpClientMock.connect).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it("연결 실패 시 오류를 로깅하고 false를 반환해야 함", async () => {
            const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
            tcpClientMock.connect.mockRejectedValueOnce(new Error("Connection failed"));

            const result = await client.connectClient();

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Connection failed. Retrying in 10 minutes...",
                expect.any(Error),
            );
            expect(result).toBe(false);

            consoleErrorSpy.mockRestore();
        });
    });
});
