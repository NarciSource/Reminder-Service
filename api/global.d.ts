declare global {
    namespace NodeJS {
        interface ProcessEnv {
            COGNITO_USER_POOL_ID: string;
            COGNITO_CLIENT_ID: string;

            PORT: number;

            MS_HOST: string;
            MS_PORT: number;

            DB_LOCAL: string;
            DB_HOST: string;
            DB_PORT: number;
        }
    }
}

export {};
