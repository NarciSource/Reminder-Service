import { Inject } from "@nestjs/common";
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";

import ReminderEntity from "@/domain/model/entity";
import { ReminderRepository } from "../port.out/repository";
import RegisterCommand from "./register.command";

@CommandHandler(RegisterCommand)
export default class RegisterHandler implements ICommandHandler<RegisterCommand> {
    constructor(
        @Inject(ReminderRepository)
        private readonly repository: ReminderRepository,
    ) {}

    /**
     * 주어진 이벤트 ID, 전송 시간, 상태를 기반으로 알림 엔티티를 생성하고 저장소에 저장합니다.
     *
     * @param {RegisterCommand} command - 알림 등록 요청 커맨드 페이로드
     * @returns 생성된 알림 엔티티
     */
    async execute({ event_id, send_at, status }: RegisterCommand): Promise<ReminderEntity> {
        const entity = new ReminderEntity(event_id, send_at, status); // 도메인 객체 생성

        return this.repository.create(entity); // ORM 엔티티 생성
    }
}
