import { promises as fsPromises } from "node:fs";
import { NestFactory } from "@nestjs/core";
import * as YAML from "yamljs";

import generatorSwagger from "@/infrastructure/config/generator-swagger";
import { NotificationModule } from "../module";
import { openapi } from "./download-open-api";

jest.mock("@nestjs/core", () => ({
    NestFactory: {
        create: jest.fn(),
    },
}));

jest.mock("yamljs", () => ({
    stringify: jest.fn().mockReturnValue("yaml-content"),
}));

jest.mock("@/infrastructure/config/generator-swagger");

describe("openapi", () => {
    let mockApp: any;

    beforeEach(() => {
        mockApp = {}; // fake app object
        (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
        (generatorSwagger as jest.Mock).mockReturnValue({ swagger: "doc" });

        jest.spyOn(fsPromises, "writeFile").mockResolvedValue(undefined);
        jest.spyOn(fsPromises, "mkdir").mockResolvedValue(undefined);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("스웨거 yaml 파일을 생성하고 작성", async () => {
        const processExitSpy = jest.spyOn(process, "exit").mockImplementation(() => {
            throw new Error("exit"); // 실행을 멈추기 위한 예외
        });

        try {
            await openapi();
        } catch (e: any) {
            expect(e.message).toBe("exit");
        }

        expect(NestFactory.create).toHaveBeenCalledWith(NotificationModule);
        expect(generatorSwagger).toHaveBeenCalledWith(mockApp);
        expect(YAML.stringify).toHaveBeenCalledWith({ swagger: "doc" }, 10, 2);
        expect(fsPromises.writeFile).toHaveBeenCalledWith("../dist/openapi.yaml", "yaml-content");
        expect(processExitSpy).toHaveBeenCalledWith(0);

        processExitSpy.mockRestore();
    });

    it("mkdir이 실패하면 오류와 함께 종료", async () => {
        (fsPromises.mkdir as jest.Mock).mockRejectedValueOnce(new Error("mkdir 실패"));
        const processExitSpy = jest.spyOn(process, "exit").mockImplementation(() => {
            throw new Error("exit");
        });
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

        try {
            await openapi();
        } catch (e: any) {
            expect(e.message).toBe("exit");
        }

        expect(consoleErrorSpy).toHaveBeenCalledWith("Error creating directory", expect.any(Error));
        expect(processExitSpy).toHaveBeenCalledWith(1);

        processExitSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });
});
