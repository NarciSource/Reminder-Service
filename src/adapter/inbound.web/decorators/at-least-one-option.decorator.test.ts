import { validate } from "class-validator";

import { AtLeastOneOption } from "./at-least-one-option.decorator";

class TestClass {
    @AtLeastOneOption({ message: "적어도 하나의 옵션이 제공되어야 합니다." })
    options: Record<string, any>;
}

describe("AtLeastOneOption 데코레이터", () => {
    it("객체에 적어도 하나의 속성이 있을 때 유효성 검사가 통과", async () => {
        const instance = new TestClass();
        instance.options = { key: "value" };

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it("객체가 비어 있을 때 유효성 검사가 실패", async () => {
        const instance = new TestClass();

        const errors = await validate(instance);

        expect(errors.length).toBe(1);
        expect(errors[0].constraints).toHaveProperty("AtLeastOneOption");
        expect(errors[0].constraints?.AtLeastOneOption).toBe("적어도 하나의 옵션이 제공되어야 합니다.");
    });
});
