import { Inject } from "@nestjs/common";
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";

import NotificationEntity from "@/domain/model/entity";
import { NotificationRepository } from "../port.out/repository";
import UpdateCommand from "./update.command";

@CommandHandler(UpdateCommand)
export default class UpdateHandler implements ICommandHandler<UpdateCommand> {
    constructor(
        @Inject(NotificationRepository)
        private repository: NotificationRepository,
    ) {}

    /**
     * 기존 알림을 업데이트합니다.
     *
     * @param {UpdateCommand} command - 업데이트 요청 커맨드 페이로드
     * @returns 업데이트된 알림 엔티티
     * @throws Error 엔티티가 존재하지 않을 경우
     */
    async execute({ event_id, send_at, status }: UpdateCommand) {
        const entity = new NotificationEntity(event_id, send_at, status); // 도메인 객체 생성

        return this.repository.update(event_id, entity);
    }
}
