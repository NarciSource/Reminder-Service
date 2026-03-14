import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const browser_access_url = `http://${process.env.PUBLIC_BASE_DOMAIN}:${process.env.PUBLIC_BASE_PORT}/auth/realms/dev`;
const client_id = process.env.KEYCLOAK_CLIENT_ID;

/**
 * 주어진 Nest 애플리케이션 인스턴스를 사용하여 Swagger 문서를 생성하고 설정합니다.
 *
 * @param app Swagger 문서를 생성할 대상이 되는 Nest 애플리케이션 인스턴스
 * @returns 생성된 Swagger 문서 객체
 *
 * @remarks
 * - Swagger 설정은 `DocumentBuilder`를 사용하여 구성됩니다.
 * - Bearer 인증 방식이 추가됩니다.
 * - 생성된 Swagger 문서는 `/swagger-ui` 경로에서 UI로 접근할 수 있습니다.
 */
export default function generatorSwagger(app: INestApplication<any>) {
    const oauth_scheme_name = "OAuth2";

    // Swagger
    const swagger_config = new DocumentBuilder()
        .setTitle("알림 API")
        .setDescription("API 명세서")
        .setVersion("v1")

        .addOAuth2(
            {
                type: "oauth2",
                flows: {
                    authorizationCode: {
                        authorizationUrl: `${browser_access_url}/protocol/openid-connect/auth`,
                        tokenUrl: `${browser_access_url}/protocol/openid-connect/token`,
                        scopes: {
                            openid: "OpenID Connect",
                        },
                    },
                },
            },
            oauth_scheme_name,
        )
        .addSecurityRequirements(oauth_scheme_name)
        .build();

    // Swagger 설정
    const document = SwaggerModule.createDocument(app, swagger_config);

    // Swagger UI 설정
    SwaggerModule.setup("swagger-ui", app, document, {
        swaggerOptions: {
            persistAuthorization: true,

            initOAuth: {
                clientId: client_id,
                usePkceWithAuthorizationCodeGrant: true,
                scopes: ["openid"],
            },
        },
        jsonDocumentUrl: "v3/api-docs",
    });

    return document;
}
