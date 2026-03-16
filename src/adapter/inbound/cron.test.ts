import { SchedulerRegistry } from "@nestjs/schedule";
import { Test, type TestingModule } from "@nestjs/testing";
import { CronJob } from "cron";

import { WorkerCronService } from "./cron";

describe("WorkerCronService", () => {
    let cronService: WorkerCronService;
    let registry: SchedulerRegistry;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WorkerCronService,
                {
                    provide: SchedulerRegistry,
                    useValue: {
                        addCronJob: jest.fn(),
                    },
                },
            ],
        }).compile();

        cronService = module.get<WorkerCronService>(WorkerCronService);
        registry = module.get<SchedulerRegistry>(SchedulerRegistry);
    });

    it("서비스 정의", () => {
        expect(cronService).toBeDefined();
    });

    describe("크론 잡 스케줄", () => {
        it("기본 스케줄", () => {
            const addCronJobSpy = jest.spyOn(registry, "addCronJob");

            delete process.env.CRON_SCHEDULE; // 환경 변수를 삭제
            cronService.onModuleInit();

            expect(addCronJobSpy).toHaveBeenCalledWith("workerCronJob", expect.any(CronJob));
        });

        it("크론 작업을 생성하고 시작", () => {
            const addCronJobSpy = jest.spyOn(registry, "addCronJob");
            const cronJobSpy = jest.spyOn(CronJob.prototype, "start");

            process.env.CRON_SCHEDULE = "EVERY_MINUTE"; // 환경 변수를 모킹
            cronService.onModuleInit();

            expect(addCronJobSpy).toHaveBeenCalledWith("workerCronJob", expect.any(CronJob));
            expect(cronJobSpy).toHaveBeenCalled();
        });
    });
});
