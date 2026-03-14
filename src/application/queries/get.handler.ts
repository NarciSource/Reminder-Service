import { Inject } from "@nestjs/common";
import { type IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import type NotificationEntity from "@/domain/model/entity";
import { NotificationRepository } from "../port.out/notification.repository";
import GetQuery from "./get.query";

@QueryHandler(GetQuery)
export default class GetHandler implements IQueryHandler<GetQuery> {
    constructor(
        @Inject(NotificationRepository)
        private readonly repository: NotificationRepository,
    ) {}

    /**
     * 특정 알림을 조회합니다.
     *
     * @param {GetQuery} query - 알림 조회 요청 쿼리 페이로드
     */
    async execute({ event_id }: GetQuery): Promise<NotificationEntity> {
        return this.repository.findById(event_id);
    }
}
