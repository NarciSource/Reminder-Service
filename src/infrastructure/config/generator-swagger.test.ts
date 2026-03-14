import type { INestApplication } from "@nestjs/common";
import { SwaggerModule } from "@nestjs/swagger";
import { Test, type TestingModule } from "@nestjs/testing";

import generatorSwagger from "./generator-swagger";

describe("generatorSwagger", () => {
    let app: INestApplication;
    let createDocumentSpy: jest.SpyInstance;
    let setupSpy: jest.SpyInstance;

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({}).compile();

        app = moduleRef.createNestApplication();
        await app.init();

        createDocumentSpy = jest.spyOn(SwaggerModule, "createDocument");
        setupSpy = jest.spyOn(SwaggerModule, "setup");
    });

    afterAll(async () => {
        if (app) await app.close();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Swagger 문서를 올바르게 생성하고 설정한다", () => {
        // given
        const mockDocument = { openapi: "3.0.0" };

        createDocumentSpy.mockReturnValue(mockDocument as any);

        // when
        const document = generatorSwagger(app);

        // then
        expect(createDocumentSpy).toHaveBeenCalledWith(
            app,
            expect.objectContaining({
                info: expect.anything(),
            }),
        );

        expect(setupSpy).toHaveBeenCalledWith(
            "swagger-ui",
            app,
            mockDocument,
            expect.objectContaining({
                jsonDocumentUrl: "v3/api-docs",
                swaggerOptions: expect.objectContaining({
                    persistAuthorization: true,
                    initOAuth: expect.anything(),
                }),
            }),
        );

        expect(document).toBe(mockDocument);
    });
});
