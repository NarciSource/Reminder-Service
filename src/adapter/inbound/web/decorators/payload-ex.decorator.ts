import { BadRequestException, createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

/**
 * `PayloadEX` 데코레이터는 RPC 컨텍스트에서 전달된 메시지의 payload를 특정 DTO 클래스로 변환하고,
 * 해당 DTO 인스턴스에 대해 유효성 검사를 수행합니다.
 *
 * @param DTOClass - 변환 및 유효성 검사에 사용할 DTO 클래스
 * @returns 변환되고 유효성이 검증된 DTO 인스턴스
 *
 * @throws {BadRequestException} 유효성 검사에 실패한 경우 예외를 발생시킵니다.
 */
export const PayloadEXFactory = (DTOClass: any) => async (_data: unknown, ctx: ExecutionContext) => {
    // 메시지의 payload 가져오기
    const payload = ctx.switchToRpc().getData();

    // DTO 변환
    const dtoInstance = plainToInstance(DTOClass, payload);

    // 유효성 검사
    const errors = await validate(dtoInstance);
    if (errors.length > 0) {
        throw new BadRequestException(`Validation failed: ${JSON.stringify(errors.map((e) => e.constraints))}`);
    }

    return dtoInstance;
};

export function PayloadEX(DTOClass: any) {
    return createParamDecorator(PayloadEXFactory(DTOClass))();
}
