import { NestFactory } from "@nestjs/core";

import { WorkerModule } from "./module";

jest.mock("@nestjs/core", () => ({
    NestFactory: {
        create: jest.fn().mockResolvedValue({
            init: jest.fn().mockResolvedValue(undefined),
        }),
    },
}));

describe("bootstrap", () => {
    it(" 애플리케이션을 초기화", async () => {
        const mockCreate = jest.spyOn(NestFactory, "create");
        const mockInit = jest.fn();
        (NestFactory.create as jest.Mock).mockResolvedValueOnce({
            init: mockInit,
        });

        const { bootstrap } = require("./main");
        await bootstrap();

        expect(mockCreate).toHaveBeenCalledWith(WorkerModule);
        expect(mockInit).toHaveBeenCalled();
    });
});
