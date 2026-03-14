import { plainToClass } from "class-transformer";

import { TrimSeconds } from "./trim-seconds.decorator";

class TestClass {
    @TrimSeconds()
    date!: Date;
}

describe("TrimSeconds Decorator", () => {
    it("유효한 Date 객체에 대해 분과 초를 0으로 설정", () => {
        const inputDate = new Date("2023-10-01T12:34:56.789Z");

        const transformed = plainToClass(TestClass, { date: inputDate });

        expect(transformed.date.getMinutes()).toBe(0);
        expect(transformed.date.getSeconds()).toBe(0);
        expect(transformed.date.getMilliseconds()).toBe(0);
        expect(transformed.date.getHours()).toBe(inputDate.getHours());
    });

    it("Date 객체가 아닌 값은 변경되지 않고 반환", () => {
        const inputValue = "not-a-date";

        const transformed = plainToClass(TestClass, { date: inputValue });

        expect(transformed.date).toBe(inputValue);
    });

    it("null 또는 undefined 값을 올바르게 처리", () => {
        const transformedWithNull = plainToClass(TestClass, { date: null });
        const transformedWithUndefined = plainToClass(TestClass, { date: undefined });

        expect(transformedWithNull.date).toBeNull();
        expect(transformedWithUndefined.date).toBeUndefined();
    });
});
