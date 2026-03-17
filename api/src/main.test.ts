import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";

process.env.COGNITO_USER_POOL_ID = "dummy-pool-id";
process.env.COGNITO_CLIENT_ID = "dummy-client-id";

import { JwtInterceptor } from "@/infrastructure/auth/jwt.interceptor";
import { ApiModule } from "./module";

jest.mock("@nestjs/core", () => ({
    NestFactory: {
        create: jest.fn(),
    },
}));

jest.mock("aws-jwt-verify", () => {
    return {
        CognitoJwtVerifier: {
            create: jest.fn().mockReturnValue({
                verify: jest.fn().mockRejectedValue(new Error("Invalid token")),
            }),
        },
    };
});

jest.mock("@/infrastructure/auth/jwt.interceptor");

describe("bootstrap", () => {
    let mockApp: any;

    beforeEach(() => {
        mockApp = {
            get: jest.fn().mockReturnValue({ setup: jest.fn() }),
            useGlobalPipes: jest.fn(),
            useGlobalInterceptors: jest.fn(),
            listen: jest.fn(),
            connectMicroservice: jest.fn(),
            startAllMicroservices: jest.fn(),
        };

        (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("애플리케이션을 초기화하고 글로벌 파이프와 인터셉터를 설정", async () => {
        process.env.PORT = 3000;
        process.env.MS_PORT = 3001;

        const { bootstrap } = require("./main");
        await bootstrap();

        expect(NestFactory.create).toHaveBeenCalledWith(ApiModule);
        expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(expect.any(ValidationPipe));
        expect(mockApp.useGlobalInterceptors).toHaveBeenCalledWith(expect.any(JwtInterceptor));
        expect(mockApp.listen).toHaveBeenCalledWith("3000");
        expect(mockApp.connectMicroservice).toHaveBeenCalledWith(
            expect.objectContaining({
                transport: Transport.TCP,
                options: expect.objectContaining({
                    host: expect.any(String),
                    port: expect.any(String),
                }),
            }),
        );
        expect(mockApp.startAllMicroservices).toHaveBeenCalled();
    });
});
