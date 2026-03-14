import { validate } from "class-validator";

import { IsTimeRange } from "./is-time-range.decorator";

class TestClass {
    start_time?: Date;
    end_time?: Date;

    @IsTimeRange()
    time_range?: string;
}

describe("IsTimeRange Decorator", () => {
    it("start_time이 end_time보다 작고 둘 다 제공된 경우 유효성 검사가 통과", async () => {
        const instance = new TestClass();
        instance.start_time = new Date("2023-01-01T10:00:00Z");
        instance.end_time = new Date("2023-01-01T12:00:00Z");

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it("start_time만 제공된 경우 유효성 검사 실패", async () => {
        const instance = new TestClass();
        instance.start_time = new Date("2023-01-01T10:00:00Z");

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty(
            "TimeRangeConstraint",
            `"start_time" and "end_time" must both be provided or both omitted.`,
        );
    });

    it("end_time만 제공된 경우 유효성 검사 실패", async () => {
        const instance = new TestClass();
        instance.end_time = new Date("2023-01-01T12:00:00Z");

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty(
            "TimeRangeConstraint",
            `"start_time" and "end_time" must both be provided or both omitted.`,
        );
    });

    it("start_time이 end_time보다 큰 경우 유효성 검사 실패", async () => {
        const instance = new TestClass();
        instance.start_time = new Date("2023-01-01T12:00:00Z");
        instance.end_time = new Date("2023-01-01T10:00:00Z");

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty(
            "TimeRangeConstraint",
            `"start_time" and "end_time" must both be provided or both omitted.`,
        );
    });

    it("start_time과 end_time이 모두 제공되지 않은 경우 유효성 검사가 통과", async () => {
        const instance = new TestClass();
        instance.time_range = null;

        const errors = await validate(instance);
        expect(errors.length).toBe(0);
    });
});
