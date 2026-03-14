import { promises } from "node:fs";
import { NestFactory } from "@nestjs/core";
import * as YAML from "yamljs";

import generatorSwagger from "@/infrastructure/config/generator-swagger";
import { NotificationModule } from "../module";

/**
 * OpenAPI 명세서를 생성하고 YAML 파일로 저장하는 함수입니다.
 *
 * @throws 디렉토리 생성 또는 파일 쓰기 중 오류가 발생할 경우 에러를 출력하고 프로세스를 종료합니다.
 */
export async function openapi() {
    const app = await NestFactory.create(NotificationModule);

    // Swagger 명세서 생성
    const document = generatorSwagger(app);

    // Swagger JSON을 YAML로 변환
    const yamlDocument = YAML.stringify(document, 10, 2);

    // dist 디렉토리 생성
    try {
        await promises.mkdir("../dist", { recursive: true });
    } catch (err) {
        console.error("Error creating directory", err);
        process.exit(1);
    }

    try {
        await promises.writeFile("../dist/openapi.yaml", yamlDocument);
    } catch (err) {
        console.error("Error writing file", err);
        process.exit(1);
    }

    console.log("Swagger spec saved to openapi.yaml");
    process.exit(0);
}

if (require.main === module) {
    openapi();
}
