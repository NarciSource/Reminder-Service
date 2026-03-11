import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";

import { JwtInterceptor } from "infrastructure/auth/jwtInterceptor";
import verifyJwt from "infrastructure/auth/verifyJwt";
import { NotificationModule } from "../src/module";

jest.mock("infrastructure/auth/verifyJwt", () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe("Bootstrap E2E Test", () => {
    const request = require("supertest");

    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [NotificationModule], // NotificationModule을 테스트 모듈로 사용
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalInterceptors(new JwtInterceptor());

        await app.init();
    });

    afterAll(async () => {
        if (app) await app.close(); // 애플리케이션 종료
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("헬스 체크 엔드포인트는 JWT 없이 통과", async () => {
        await request(app.getHttpServer())
            .get("/")
            .expect(200);
    });

    it("JWT 없으면 보호된 API는 401", async () => {
        await request(app.getHttpServer())
            .get("/1")
            .expect(401);
    });

    it("잘못된 JWT면 401", async () => {
        (verifyJwt as jest.Mock).mockRejectedValue(
            new Error("invalid token"),
        );

        await request(app.getHttpServer())
            .get("/1")
            .set("Authorization", "Bearer invalid-token")
            .expect(401);
    });

    it("정상 JWT면 통과", async () => {
        const mockUser = { sub: "user1" };

        (verifyJwt as jest.Mock).mockResolvedValue(mockUser);

        const res = await request(app.getHttpServer())
            .get("/1")
            .set("Authorization", "Bearer valid-token")
            .expect(200);

        expect(res.body).toBeDefined();
    });
});
