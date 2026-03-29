import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { ScheduleModule } from "@nestjs/schedule";
import type Redis from "ioredis";

import { WorkerCronService } from "@/adapter/inbound/cron";
import { HttpScheduleClient, OneSignalNotificationClient, TcpReminderClient } from "@/adapter/outbound/api";
import { RedisZSetDelayQueue } from "@/adapter/outbound/messaging";
import { commands, events } from "@/application";
import { NotificationClient, ReminderClient, ScheduleClient } from "@/application/port.out/api";
import type { DelayQueue } from "@/application/port.out/messaging/delay-queue";
import { REMINDER_DELAY_QUEUE } from "@/application/port.out/messaging/token";
import { DelayQueueSource, ReminderSource } from "@/application/port.out/source";
import { RedisModule } from "@/infrastructure/persistence/redis";
import { REDIS_STORAGE } from "@/infrastructure/persistence/redis/provider";

/**
 * @module WorkerModule
 *
 * 이 모듈은 작업자(Worker) 서비스와 관련된 기능을 제공합니다.
 * 스케줄링, 환경설정, 알림 발송, 스케줄 이벤트 수신 등 다양한 기능을 포함합니다.
 *
 * - `imports`: 서비스와 인프라스트럭처를 정의합니다.
 *   - `ScheduleModule`: 작업 스케줄링을 위한 모듈입니다.
 *   - `ConfigModule`: 환경설정을 전역적으로 관리하기 위한 모듈입니다.
 *   - `CqrsModule`: CQRS 패턴을 구현하기 위한 모듈입니다.
 *   - `RedisModule`: Redis와의 상호작용을 위한 모듈입니다.
 *
 * - `providers`: 서비스와 인프라스트럭처를 정의합니다.
 *   - `WorkerCronService`: 작업자 크론 작업을 처리합니다.
 *   - `commands`와 `events`: 애플리케이션의 명령과 이벤트 핸들러를 제공합니다.
 *   - `ReminderClient`: Reminder 마이크로서비스와의 TCP 통신을 처리하는 클라이언트입니다.
 *   - `ScheduleClient`: 스케줄 이벤트 수신을 처리하는 클라이언트입니다.
 *   - `NotificationClient`: 알림 발송을 처리하는 클라이언트입니다.
 *   - `REMINDER_DELAY_QUEUE`: 메시징 지연 큐를 처리하는 인프라입니다.
 *   - `ReminderSource`: 알림 조회를 처리하는 소스입니다.
 */
@Module({
    imports: [
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [".env.local", ".env"],
        }),
        CqrsModule,
        RedisModule,
    ],
    providers: [
        /** 진입점 */
        WorkerCronService,

        /** 유즈케이스 */
        ...Object.values(commands),
        ...Object.values(events),

        /** 외부 서비스 호출 */
        {
            // API 마이크로서비스 TCP 송발신 클라이언트
            provide: ReminderClient, // 인터페이스 제공
            useClass: TcpReminderClient, // 구현체 연결
        },
        {
            // 스케줄 이벤트 수신하는 클라이언트
            provide: ScheduleClient,
            useClass: HttpScheduleClient,
        },
        {
            // 알림 발송하는 클라이언트
            provide: NotificationClient,
            useClass: OneSignalNotificationClient,
        },

        /** 메시징 */
        {
            provide: REMINDER_DELAY_QUEUE,
            useFactory: (redis: Redis) => new RedisZSetDelayQueue(redis, "reminder-delay-queue"),
            inject: [REDIS_STORAGE],
        },

        /** 알림 조회 소스 */
        {
            provide: ReminderSource,
            useFactory: (queue: DelayQueue) => new DelayQueueSource(queue),
            inject: [REMINDER_DELAY_QUEUE],
        },
    ],
})
export class WorkerModule {}
