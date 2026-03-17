import { BadRequestException, type ExecutionContext } from "@nestjs/common";
import { IsString } from "class-validator";

import { PayloadEXFactory } from "./payload-ex.decorator";

class TestDTO {
    @IsString()
    value: string;
}

describe("PayloadEXFactory", () => {
    const mockGetData = jest.fn();
    const mockContext: Partial<ExecutionContext> = {
        switchToRpc: () => ({
            getData: mockGetData,
            getContext: jest.fn(),
        }),
    };

    it("유효성 검사 통과", async () => {
        mockGetData.mockReturnValue({ value: "mock-value" });
        const handler = PayloadEXFactory(TestDTO);

        const result = await handler(undefined, mockContext as ExecutionContext);

        expect(result).toBeInstanceOf(TestDTO);
        expect((result as unknown as TestDTO).value).toBe("mock-value");
    });

    it("유효성 검사 실패", async () => {
        mockGetData.mockReturnValue({ value: 1234 });
        const handler = PayloadEXFactory(TestDTO);

        await expect(handler(undefined, mockContext as ExecutionContext)).rejects.toThrow(BadRequestException);
    });
});
