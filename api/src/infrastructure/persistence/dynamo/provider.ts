import type { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import * as dynamoose from "dynamoose";

export const DYNAMO_STORAGE = Symbol("dynamo-storage");

/**
 * @module provider
 *
 * @property {string} provide - 의존성 주입을 위한 토큰 이름 (DYNAMO_STORAGE).
 * @property {Function} useFactory - Dynamoose 설정을 생성하는 팩토리 함수입니다.
 *
 * @function useFactory
 * Dynamoose 설정을 초기화하고 AWS DynamoDB 클라이언트를 구성합니다.
 *
 * - 로컬 환경 (`DB_LOCAL`이 "true"로 설정된 경우):
 *   - 가짜 자격 증명 (`accessKeyId`, `secretAccessKey`)을 사용합니다.
 *   - `endpoint`는 `http://<DB_HOST>:<DB_PORT>` 형식으로 설정됩니다.
 *   - `region`은 "local"로 설정됩니다.
 *
 * - 프로덕션 환경:
 *   - AWS 자격 증명을 사용하며, `region`은 "ap-northeast-2"로 설정됩니다.
 *
 * @returns {typeof dynamoose} 설정된 Dynamoose 인스턴스를 반환합니다.
 */
export default {
    provide: DYNAMO_STORAGE,
    useFactory: () => {
        const DB_LOCAL = process.env.DB_LOCAL === "true";
        const DB_HOST = process.env.DB_HOST || "localhost";
        const DB_PORT = process.env.DB_PORT || 8000;

        let config: DynamoDBClientConfig;
        if (DB_LOCAL) {
            config = {
                credentials: {
                    // 로컬에서는 fake 자격 증명을 사용
                    accessKeyId: "fakeKey",
                    secretAccessKey: "fakeSecretKey",
                },
                endpoint: `http://${DB_HOST}:${DB_PORT}`,
                region: "local", // 로컬 설정
            };
        } else {
            config = {
                // AWS 자격 증명을 사용
                region: "ap-northeast-2",
            };
        }

        const ddb = new dynamoose.aws.ddb.DynamoDB(config);
        dynamoose.aws.ddb.set(ddb);

        return dynamoose;
    },
};
