export const moduleNameMapper = {
    // 모듈 이름을 매핑
    "^@/(.*)$": "<rootDir>/src/$1",
};
export const testRegex = ".*\\.(e2e-spec|spec|test)\\.ts$";
export const transform = {
    // ts-jest를 사용하여 테스트 파일을 해석
    "^.+\\.(t|j)s$": "ts-jest",
};
