import {
    registerDecorator,
    type ValidationArguments,
    type ValidationOptions,
    ValidatorConstraint,
    type ValidatorConstraintInterface,
} from "class-validator";

/**
 * @ValidatorConstraint 데코레이터를 사용하여 정의된 클래스입니다.
 * 이 클래스는 객체가 적어도 하나의 옵션을 가지고 있는지 확인하는 유효성 검사 로직을 제공합니다.
 *
 * @class AtLeastOneOptionConstraint
 * @implements {ValidatorConstraintInterface}
 */
@ValidatorConstraint({ name: "AtLeastOneOption", async: false })
class AtLeastOneOptionConstraint implements ValidatorConstraintInterface {
    /**
     * 주어진 객체가 비어 있지 않은지 확인하는 유효성 검사 함수입니다.
     *
     * @param _value - 검사할 값 (사용되지 않음).
     * @param object - 유효성 검사에 사용되는 객체를 포함하는 ValidationArguments.
     * @returns 객체가 비어 있지 않으면 `true`, 비어 있으면 `false`를 반환합니다.
     */
    validate(_value: any, { object }: ValidationArguments): boolean {
        return Object.keys(object).length !== 0;
    }
}

/**
 * 객체의 특정 속성에 대해 최소 하나의 옵션이 존재하는지 확인하는 데코레이터입니다.
 *
 * @param validationOptions - 유효성 검사 옵션을 지정하는 선택적 매개변수입니다.
 *
 * @returns 데코레이터 함수로, 지정된 객체와 속성 이름에 대해 유효성 검사를 등록합니다.
 */
export function AtLeastOneOption(validationOptions?: ValidationOptions) {
    /**
     * 실제 데코레이터 함수
     * @param object - 데코레이터가 붙은 클래스 인스턴스
     * @param propertyName - 데코레이터가 붙은 속성 이름
     */
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: AtLeastOneOptionConstraint, // 유효성 검사기
        });
    };
}
