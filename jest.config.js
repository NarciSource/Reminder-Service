module.exports = {
    // 기본 설정
    preset: "ts-jest",
    testEnvironment: "node",
    rootDir: ".", // 루트 경로 지정
    moduleFileExtensions: ["js", "ts", "json"],

    projects: [
        // 워크스페이스
        "<rootDir>/notification",
        "<rootDir>/worker",
        // 루트 e2e
        "<rootDir>/test",
    ],

    // 커버리지 수집 설정
    collectCoverage: true,
    collectCoverageFrom: ["**/*.{ts,js}", "!**/node_modules/**", "!**/dist/**", "!**/*.config.{ts,js}", "!**/*.d.ts"],
    coverageDirectory: "dist/coverage",
    coverageReporters: ["html", "lcov", "text-summary"],

    // 리포터 설정 (기본 + HTML 리포트)
    reporters: [
        "default",
        [
            "jest-html-reporters",
            {
                pageTitle: "Reminder Test Report",
                publicPath: "./dist",
                filename: "test-report.html",
                includeFailureMsg: true, // 실패 메시지 포함
                expand: true, // 모든 테스트 결과 확장
            },
        ],
    ],
};
