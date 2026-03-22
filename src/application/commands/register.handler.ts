import { Inject } from "@nestjs/common";
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";

import ReminderEntity from "@/domain/model/entity";
import { DelayQueue } from "../port.out/messaging";
import { ReminderRepository } from "../port.out/repository";
import RegisterCommand from "./register.command";

@CommandHandler(RegisterCommand)
export default class RegisterHandler implements ICommandHandler<RegisterCommand> {
    constructor(
        @Inject(ReminderRepository)
        private readonly repository: ReminderRepository,
        @Inject(DelayQueue)
        private readonly delayQueue: DelayQueue,
    ) {}

    /**
     * 주어진 이벤트 ID, 전송 시간, 상태를 기반으로 알림 엔티티를 생성하고 지연큐와 저장소에 저장합니다.
     *
     * @param {RegisterCommand} command - 알림 등록 요청 커맨드 페이로드
     * @returns 생성된 알림 엔티티
     */
    async execute({ event_id, send_at, status }: RegisterCommand) {
        const entity = new ReminderEntity(event_id, send_at, status); // 도메인 객체 생성

        this.repository.create(entity); // ORM 엔티티 생성

        this.delayQueue.schedule(event_id, send_at); // Redis 지연 큐에 작업 예약
    }
}
