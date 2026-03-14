import { DocumentBuilder } from "@nestjs/swagger";

export const SWAGGER_CONFIG = Symbol("SWAGGER_CONFIG");

export const swaggerConfigProvider = {
    provide: SWAGGER_CONFIG,
    useFactory: () => {
        const oauth_scheme_name = "OAuth2";
        const browser_access_url = `http://${process.env.PUBLIC_BASE_DOMAIN}:${process.env.PUBLIC_BASE_PORT}/auth/realms/dev`;

        return new DocumentBuilder()
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
                            scopes: { openid: "OpenID Connect" },
                        },
                    },
                },
                oauth_scheme_name,
            )
            .addSecurityRequirements(oauth_scheme_name)
            .build();
    },
};
