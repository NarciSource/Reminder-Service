import "ioredis";

declare module "ioredis" {
    interface RedisCommander<Context> {
        pollDue(key: string, now: number): Promise<string[]>;
    }
}
