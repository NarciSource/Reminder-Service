import { Inject } from "@nestjs/common";
import { type IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import type ReminderEntity from "@/domain/model/entity";
import { ReminderRepository } from "../port.out/repository";
import ListQuery from "./list.query";

@QueryHandler(ListQuery)
export default class ListHandler implements IQueryHandler<ListQuery> {
    constructor(
        @Inject(ReminderRepository)
        private readonly repository: ReminderRepository,
    ) {}

    /**
     * 주어진 필터 조건에 따라 알림 엔티티 목록을 가져옵니다.
     *
     * @param {FindQuery} query - 알림 검색 요청 쿼리 페이로드
     * @returns 필터링된 알림 엔티티 배열
     */
    async execute({ start_time, end_time, status }: ListQuery): Promise<ReminderEntity[]> {
        return this.repository.findBetween(start_time, end_time, status);
    }
}
