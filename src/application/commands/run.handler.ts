import { CommandHandler, type EventBus, type ICommandHandler } from "@nestjs/cqrs";

import { SendEvent } from "../events";
import RunCommand from "./run.command";

@CommandHandler(RunCommand)
export default class RunHandler implements ICommandHandler<RunCommand> {
    constructor(private readonly eventBus: EventBus) {}

    /**
     * 알림 발송 작업을 시작합니다. 특정 시간 범위 내에서 발송 대기 상태인 알림을 조회하고,
     * 각 알림을 발송한 후 상태를 업데이트합니다.
     *
     * @throws {Error} 발송 처리 중 에러가 발생할 경우 에러를 로깅합니다.
     */
    async execute({ job }: RunCommand) {
        switch (job.name) {
            case "dispatch": {
                const event = new SendEvent(job.data);

                await this.eventBus.publish(event);
            }
        }
    }
}
