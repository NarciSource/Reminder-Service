import { Inject } from "@nestjs/common";
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";

import { ReminderDelayQueue } from "../port.out/messaging";
import { ReminderRepository } from "../port.out/repository";
import DeleteCommand from "./delete.command";

@CommandHandler(DeleteCommand)
export default class DeleteHandler implements ICommandHandler<DeleteCommand> {
    constructor(
        @Inject(ReminderRepository)
        private readonly repository: ReminderRepository,
        @Inject(ReminderDelayQueue)
        private readonly delayQueue: ReminderDelayQueue,
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
