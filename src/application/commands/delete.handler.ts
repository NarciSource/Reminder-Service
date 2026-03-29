import { Inject } from "@nestjs/common";
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";

import type { DelayQueue } from "../port.out/messaging";
import { REMINDER_DELAY_QUEUE } from "../port.out/messaging/token";
import { ReminderRepository } from "../port.out/repository";
import DeleteCommand from "./delete.command";

@CommandHandler(DeleteCommand)
export default class DeleteHandler implements ICommandHandler<DeleteCommand> {
    constructor(
        @Inject(ReminderRepository)
        private repository: ReminderRepository,
        @Inject(REMINDER_DELAY_QUEUE)
        private readonly delayQueue: DelayQueue,
    ) {}

    /**
     * 특정 알림을 삭제합니다.
     *
     * @param {DeleteCommand} command - 삭제 요청 커맨드 페이로드
     * @returns 삭제 성공 여부
     */
    async execute({ event_id }: DeleteCommand) {
        this.repository.deleteById(event_id);

        this.delayQueue.cancel(event_id); // Redis 지연 큐에서 작업 취소
    }
}
