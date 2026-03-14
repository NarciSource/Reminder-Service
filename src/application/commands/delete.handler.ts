import { Inject } from "@nestjs/common";
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";

import { NotificationRepository } from "../port.out/notification.repository";
import DeleteCommand from "./delete.command";

@CommandHandler(DeleteCommand)
export default class DeleteHandler implements ICommandHandler<DeleteCommand> {
    constructor(
        @Inject(NotificationRepository)
        private repository: NotificationRepository,
    ) {}

    /**
     * 특정 알림을 삭제합니다.
     *
     * @param {DeleteCommand} command - 삭제 요청 커맨더 페이로드
     * @returns 삭제 성공 여부
     */
    async execute({ event_id }: DeleteCommand): Promise<boolean> {
        return this.repository.deleteById(event_id);
    }
}
