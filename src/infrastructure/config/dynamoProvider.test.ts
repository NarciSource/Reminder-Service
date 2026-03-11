import * as dynamoose from "dynamoose";

import provider from "./dynamoProvider";

jest.mock("dynamoose", () => {
    const original = jest.requireActual("dynamoose");
    return {
        ...original,
        aws: {
            ddb: {
                set: jest.fn(),
                DynamoDB: jest.fn(),
            },
        },
    };
});

describe("Dynamoose Provider", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it("로컬 환경에서 Dynamoose를 구성합니다", () => {
        process.env.DB_LOCAL = "true";
        process.env.DB_HOST = "localhost";
        process.env.DB_PORT = 8000;

        const result = provider.useFactory();

        expect(dynamoose.aws.ddb.DynamoDB).toHaveBeenCalledWith({
            credentials: {
                accessKeyId: "fakeKey",
                secretAccessKey: "fakeSecretKey",
            },
            endpoint: "http://localhost:8000",
            region: "local",
        });

        expect(dynamoose.aws.ddb.set).toHaveBeenCalled();
        expect(result).toStrictEqual(dynamoose);
    });

    it("프로덕션 환경에서 Dynamoose를 구성합니다", () => {
        process.env.DB_LOCAL = "false";

        const result = provider.useFactory();

        expect(dynamoose.aws.ddb.DynamoDB).toHaveBeenCalledWith({
            region: "ap-northeast-2",
        });

        expect(dynamoose.aws.ddb.set).toHaveBeenCalled();
        expect(result).toStrictEqual(dynamoose);
    });
});
