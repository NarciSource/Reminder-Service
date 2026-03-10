import { Injectable, OnModuleInit } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";

import { WorkerService } from "./service";

/**
 * `WorkerCronService` 클래스는 작업자 서비스의 크론 작업을 처리하고 관리하는 역할을 합니다.
 */
@Injectable()
export class WorkerCronService implements OnModuleInit {
    /**
     * @param useCaseService - 작업자 서비스의 비즈니스 로직을 처리하는 데 사용되는 서비스입니다.
     * @param schedulerRegistry - 작업 스케줄링 및 관리에 사용되는 스케줄러 레지스트리입니다.
     */
    constructor(
        private readonly useCaseService: WorkerService,
        private readonly schedulerRegistry: SchedulerRegistry,
    ) {}

    /**
     * 주기적으로 실행되는 크론 작업을 처리하는 메서드입니다.
     * 현재 시간을 콘솔에 출력하고, UseCaseService의 작업을 시작합니다.
     *
     * @returns {Promise<void>} 비동기 작업이 완료되면 반환됩니다.
     */
    async handleCron(): Promise<void> {
        console.log("잡 수행 시간:", new Date());
        this.useCaseService.start();
    }

    /**
     * 모듈 초기화 시 실행되는 메서드입니다.
     *
     * - 환경 변수 `CRON_SCHEDULE` 값을 기반으로 크론 스케줄을 설정합니다.
     *   - `CRON_SCHEDULE` 값이 `CronExpression`의 키에 해당하면 해당 값을 사용합니다.
     *   - 그렇지 않으면 `CRON_SCHEDULE` 값을 크론 표현식으로 사용하거나 기본값(`CronExpression.EVERY_HOUR`)을 설정합니다.
     * - 설정된 스케줄을 기반으로 동적으로 크론 작업(CronJob)을 생성합니다.
     * - 생성된 크론 작업을 `schedulerRegistry`에 등록하고 실행합니다.
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
        this.schedulerRegistry.addCronJob("workerCronJob", job);
        // 크론잡 수행
        job.start();
    }
}
