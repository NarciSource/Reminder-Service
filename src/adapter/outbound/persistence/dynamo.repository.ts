import { Injectable } from "@nestjs/common";
import type { ModelType } from "dynamoose/dist/General";

import type { NotificationRepository } from "@/application/port.out/repository";
import type NotificationEntity from "@/domain/model/entity";
import type { NotificationStatus } from "@/domain/model/entity";
// biome-ignore lint/style/useImportType: NestJS DI requires runtime class reference
import DynamoModel from "@/infrastructure/persistence/dynamo/model";

/**
 * DynamoDB를 사용하여 알림 데이터를 관리하는 저장소 클래스입니다.
 * `NotificationRepository` 인터페이스를 구현합니다.
 */
@Injectable()
export default class DynamoRepository implements NotificationRepository {
    /**
     * @private
     * @readonly
     * DynamoDB 모델을 나타내는 속성입니다.
     * 이 속성은 데이터베이스 작업을 수행하기 위해 사용됩니다.
     *
     * @type {ModelType<any>}
     */
    private readonly model: ModelType<any>;

    /**
     * DynamoDB 모델을 초기화합니다.
     * @param model DynamoDB 모델을 제공하는 `DynamooseModel` 인스턴스
     */
    constructor(model: DynamoModel) {
        this.model = model.getModel();
    }

    async create(eventData: NotificationEntity) {
        return this.model.update({
            ...eventData,
            ttl: Math.floor(eventData.send_at.getTime() / 1000) + 60 * 60, // 1시간 후 삭제
        });
    }

    async replace(event_id: string, entity: NotificationEntity) {
        return this.model.put({
            event_id,
            ...entity,
            ttl: Math.floor(entity.send_at.getTime() / 1000) + 60 * 60,
        });
    }

    async update(event_id: string, entity: Partial<NotificationEntity>) {
        return this.model.update(
            { event_id },
            {
                $SET: {
                    ...entity,
                    ...(entity.send_at && {
                        ttl: Math.floor(entity.send_at.getTime() / 1000) + 60 * 60,
                    }),
                },
            },
        );
    }

    async findById(event_id: string) {
        return this.model.get(event_id);
    }

    async findBetween(start_time: Date, _end_time: Date, status: NotificationStatus) {
        const start_ts = new Date(start_time).getTime();

        return this.model.query("send_at").eq(start_ts).where("status").eq(status).using("send_at-status-index").exec();
    }

    async deleteById(event_id: string) {
        return this.model.delete(event_id);
    }
}
