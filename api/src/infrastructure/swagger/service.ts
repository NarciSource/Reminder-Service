import { type INestApplication, Inject, Injectable } from "@nestjs/common";
import { type OpenAPIObject, SwaggerModule } from "@nestjs/swagger";

import { SWAGGER_CONFIG } from "./provider";

@Injectable()
export class SwaggerService {
    private client_id = process.env.KEYCLOAK_CLIENT_ID;

    constructor(
        @Inject(SWAGGER_CONFIG)
        private readonly config: OpenAPIObject,
    ) {}

    setup(app: INestApplication) {
        // Swagger 설정
        const document = SwaggerModule.createDocument(app, this.config);

        // Swagger UI 설정
        SwaggerModule.setup("swagger-ui", app, document, {
            swaggerOptions: {
                persistAuthorization: true,
                initOAuth: {
                    clientId: this.client_id,
                    usePkceWithAuthorizationCodeGrant: true,
                    scopes: ["openid"],
                },
            },
            jsonDocumentUrl: "v3/api-docs",
        });

        return document;
    }
}
