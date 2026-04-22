import { Injectable } from "@nestjs/common";

import type ReminderEntity from "@/domain/model/entity";

@Injectable()
export default class ReminderTTLStrategy {
    calculate(entity: Partial<ReminderEntity>): number | undefined {
        if (!entity.send_at) return undefined;

        return Math.floor(entity.send_at.getTime() / 1000) + 60 * 60; // 1시간 후 삭제
    }
}
