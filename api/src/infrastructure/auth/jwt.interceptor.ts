import {
    type CallHandler,
    type ExecutionContext,
    Injectable,
    type NestInterceptor,
    UnauthorizedException,
} from "@nestjs/common";
import type { Observable } from "rxjs";

import verifyJwt from "./verify-jwt";

/**
 * JWT 토큰을 검증하고 요청 객체에 사용자 정보를 추가하는 NestJS 인터셉터입니다.
 */
@Injectable()
export class JwtInterceptor implements NestInterceptor {
    /**
     * HTTP 요청을 가로채 JWT 토큰을 검증하고 사용자 정보를 요청 객체에 추가하는 인터셉터입니다.
     *
     * @param context - 현재 실행 컨텍스트를 나타내며, HTTP 요청 및 컨트롤러 정보를 포함합니다.
     * @param next - 다음 핸들러로 요청을 전달하기 위한 CallHandler 객체입니다.
     * @returns Observable<any> - 검증이 완료된 후 다음 핸들러로 요청을 전달합니다.
     *
     * @throws UnauthorizedException - JWT 토큰이 없거나 유효하지 않은 경우 예외를 발생시킵니다.
     *
     * @remarks
     * - `HealthCheckController`의 경우 인터셉터를 적용하지 않고 요청을 그대로 전달합니다.
     * - 요청 헤더에서 `Authorization` 값을 추출하여 JWT 토큰을 검증합니다.
     * - 검증된 사용자 정보를 요청 객체에 추가합니다.
     */
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest(); // request 객체 가져오기
        const token = request.headers["authorization"]?.split(" ")[1]; // 'Bearer <token>'

        const controller = context.getClass();
        if (controller.name === "HealthCheckController") {
            return next.handle(); // 헬스체크 경로에서는 인터셉터를 적용하지 않음
        }

        if (!token) {
            throw new UnauthorizedException("JWT token is missing");
        }

        try {
            const decoded = await verifyJwt(token); // jwt token 검증

            request.user = decoded; // request에 user 정보 추가
        } catch (error) {
            throw new UnauthorizedException("Invalid JWT token", error);
        }

        return next.handle(); // 다음 핸들러 실행
    }
}
