import {
    registerDecorator,
    type ValidationArguments,
    type ValidationOptions,
    ValidatorConstraint,
    type ValidatorConstraintInterface,
} from "class-validator";

/**
 * 시간 범위를 나타내는 타입입니다. 시작 시간과 종료 시간을 선택적으로 포함할 수 있습니다.
 *
 * @property {Date} [start_time] - 선택적인 시작 시간입니다.
 * @property {Date} [end_time] - 선택적인 종료 시간입니다.
 */
type TimeRange = {
    start_time?: Date;
    end_time?: Date;
};

/**
 * 시간 범위 유효성을 검사하는 클래스입니다.
 *
 * 이 클래스는 `class-validator` 라이브러리의 `ValidatorConstraintInterface`를 구현하며,
 * `start_time`과 `end_time` 필드가 동시에 존재하거나 동시에 존재하지 않아야 하고,
 * `start_time`이 `end_time`보다 작아야 한다는 조건을 검증합니다.
 */
@ValidatorConstraint({ async: false })
class TimeRangeConstraint implements ValidatorConstraintInterface {
    validate(_value: TimeRange, args: ValidationArguments) {
        const { start_time, end_time } = args.object as TimeRange;

        // 동시에 존재하거나 동시에 존재하지 않아야 함
        // 시작 시간은 종료 시간보다 작아야 함
        return !!start_time === !!end_time && (!start_time || start_time < end_time);
    }

    defaultMessage(_args: ValidationArguments) {
        return `"start_time" and "end_time" must both be provided or both omitted.`;
    }
}

/**
 * 주어진 속성이 유효한 시간 범위인지 확인하는 데코레이터입니다.
 *
 * @param validationOptions - 유효성 검사 옵션을 지정하는 객체입니다.
 *
 * @returns 데코레이터 함수로, 클래스 속성에 적용됩니다.
 */
export function IsTimeRange(validationOptions?: ValidationOptions) {
    /**
     * 주어진 속성에 대해 시간 범위(TimeRange) 유효성 검사를 수행하는 데코레이터를 등록합니다.
     *
     * @param object - 데코레이터가 적용될 객체입니다.
     * @param propertyName - 유효성 검사를 적용할 속성의 이름입니다.
     *
     * @remarks
     * 이 데코레이터는 `registerDecorator`를 사용하여 특정 속성에 대해 `TimeRangeConstraint` 유효성 검사기를 등록합니다.
     */
    return (object: TimeRange, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: TimeRangeConstraint, // 유효성 검사기
        });
    };
}
