declare global {
    namespace NodeJS {
        interface ProcessEnv {
            CRON_SCHEDULE: string;
            REMINDER_READ_RANGE: string;

            SCHEDULE_API_URL: string;
            ONESIGNAL_APP_ID: string;
            ONESIGNAL_API_KEY: string;

            MS_HOST: string;
            MS_PORT: number;
        }
    }
}

export {};
