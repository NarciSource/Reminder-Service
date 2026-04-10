import { Inject } from "@nestjs/common";
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";

import type { StreamsQueue } from "../port.out/messaging/streams-queue";
import { ReminderSource } from "../port.out/source";
import RunCommand from "./run.command";

@CommandHandler(RunCommand)
export default class RunHandler implements ICommandHandler<RunCommand> {
    constructor(
        private readonly streamsQueue: StreamsQueue,
        @Inject(ReminderSource)
        private readonly source: ReminderSource,
    ) {}

    /**
     * 알림 발송 작업을 시작합니다. 특정 시간 범위 내에서 발송 대기 상태인 알림을 조회하고,
     * 각 알림을 발송한 후 상태를 업데이트합니다.
     *
     * @throws {Error} 발송 처리 중 에러가 발생할 경우 에러를 로깅합니다.
     */
    async execute() {
        const now = new Date();

        const event_ids = await this.source.getReady(now);

        for (const event_id of event_ids) {
            try {
                await this.streamsQueue.push(event_id);
            } catch (error) {
                console.error("발송 처리 중 에러 발생", error);
            }
        }
    }
}
