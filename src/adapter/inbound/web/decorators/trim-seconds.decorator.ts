import { Transform } from "class-transformer";

/**
 * 이 데코레이터는 `class-transformer`의 `Transform` 데코레이터를 활용하여
 * `Date` 객체의 분(minute)과 초(second)를 0으로 설정합니다.
 *
 * 이 데코레이터는 주어진 값이 `Date` 객체일 경우에만 동작하며,
 * 이를 통해 시간 정보를 시간 단위로만 유지할 수 있습니다.
 *
 * @returns `Transform` 데코레이터를 반환하여 값 변환 로직을 적용합니다.
 */
export function TrimSeconds() {
    return Transform(({ value }) => {
        if (value instanceof Date) {
            value.setMinutes(0, 0, 0);
        }
        return value;
    });
}
