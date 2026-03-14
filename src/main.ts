import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { type MicroserviceOptions, Transport } from "@nestjs/microservices";

import { JwtInterceptor } from "@/infrastructure/auth/jwt.interceptor";
import { SwaggerService } from "@/infrastructure/swagger/service";
import { NotificationModule } from "./module";

/**
 * 애플리케이션 부트스트랩 함수
 *
 * 이 함수는 NestJS 애플리케이션을 초기화하고 설정을 적용한 뒤
 * HTTP 서버와 마이크로서비스를 시작합니다.
 *
 * 주요 기능:
 * - NestJS 애플리케이션 생성
 * - Swagger 문서 생성
 * - 전역 파이프 설정 (ValidationPipe)
 * - 전역 인터셉터 설정 (JwtInterceptor)
 * - HTTP 서버 시작
 * - 마이크로서비스 설정 및 시작
 *
 * 환경 변수:
 * - `PORT`: HTTP 서버가 실행될 포트 (기본값: 3000)
 * - `MS_PORT`: 마이크로서비스가 실행될 포트 (기본값: 3001)
 *
 * @returns {Promise<void>} 애플리케이션 초기화 및 실행 완료 후 반환
 */
export async function bootstrap(): Promise<void> {
    // 알림 서비스 생성
    const app = await NestFactory.create(NotificationModule);

    // Swagger 설정
    const swagger = app.get(SwaggerService);
    swagger.setup(app);

    // 전역 파이프 설정
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true, // 요청 데이터를 DTO로 변환
            whitelist: true, // DTO에 없는 속성은 무시
            forbidNonWhitelisted: true, // DTO에 없는 속성이 있으면 에러
        }),
    );

    // 전역 인터셉터 설정
    app.useGlobalInterceptors(new JwtInterceptor());

    await app.listen(process.env.PORT || 3000);

    // 마이크로서비스 설정
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.TCP, // TCP 프로토콜 사용
        options: {
            host: "0.0.0.0",
            port: process.env.MS_PORT || 3001,
        },
    });

    await app.startAllMicroservices();
}

if (require.main === module) {
    bootstrap();
}
