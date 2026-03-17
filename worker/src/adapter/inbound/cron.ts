import { Injectable, type OnModuleInit } from "@nestjs/common";
import type { CommandBus } from "@nestjs/cqrs";
// biome-ignore lint/style/useImportType: NestJS DI requires runtime class reference
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";

import { RunCommand } from "@/application/commands";

/**
 * `WorkerCronService` 클래스는 작업자 서비스의 크론 작업을 처리하고 관리하는 역할을 합니다.
 */
@Injectable()
export class WorkerCronService implements OnModuleInit {
    /**
     * @param commandBus - CQRS 패턴에서 명령을 실행하기 위한 CommandBus입니다.
     * @param registry - 작업 스케줄링 및 관리에 사용되는 스케줄러 레지스트리입니다.
     */
    constructor(
        private readonly commandBus: CommandBus,
        private readonly registry: SchedulerRegistry,
    ) {}

    /**
     * 주기적으로 실행되는 크론 작업을 처리하는 메서드입니다.
     * 현재 시간을 콘솔에 출력하고, `RunCommand` 명령을 실행합니다.
     *
     * @returns {Promise<void>} 비동기 작업이 완료되면 반환됩니다.
     */
    async handleCron(): Promise<void> {
        console.log("잡 수행 시간:", new Date());

        const command = new RunCommand();
        await this.commandBus.execute(command);
    }

    /**
     * 모듈 초기화 시 실행되는 메서드입니다.
     *
     * - 환경 변수 `CRON_SCHEDULE` 값을 기반으로 크론 스케줄을 설정합니다.
     *   - `CRON_SCHEDULE` 값이 `CronExpression`의 키에 해당하면 해당 값을 사용합니다.
     *   - 그렇지 않으면 `CRON_SCHEDULE` 값을 크론 표현식으로 사용하거나 기본값(`CronExpression.EVERY_HOUR`)을 설정합니다.
     * - 설정된 스케줄을 기반으로 동적으로 크론 작업(CronJob)을 생성합니다.
     * - 생성된 크론 작업을 `SchedulerRegistry`에 등록하고 실행합니다.
     *
     * @throws {Error} `CRON_SCHEDULE` 값이 유효하지 않은 경우 예외가 발생할 수 있습니다.
     */
    onModuleInit() {
        const CRON_SCHEDULE =
            process.env.CRON_SCHEDULE in CronExpression
                ? CronExpression[process.env.CRON_SCHEDULE] // 환경 변수 값이 CronExpression 키에 있으면 설정
                : process.env.CRON_SCHEDULE || CronExpression.EVERY_HOUR; // Cron 표현식 입력이거나 기본값으로 설정

        // 스케쥴 시간을 동적으로 크론잡 생성
        const job = new CronJob(CRON_SCHEDULE, this.handleCron.bind(this)) as any;
        this.registry.addCronJob("workerCronJob", job);
        // 크론잡 수행
        job.start();
    }
}
