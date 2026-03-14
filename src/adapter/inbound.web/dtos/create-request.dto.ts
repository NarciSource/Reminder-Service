import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

import { NotificationStatus } from "@/domain/model/entity";
import { TrimSeconds } from "../decorators";

export default class CreateRequestDTO {
    @IsString()
    @ApiProperty({ description: "수행될 이벤트 ID", example: "507f1f77bcf86cd799439011" })
    event_id: string;

    @IsDate()
    @Type(() => Date)
    @TrimSeconds()
    @ApiProperty({ description: "알림 발송 시간" })
    send_at: Date;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: "알림 상태",
        enum: NotificationStatus,
        required: false,
        example: "Pending",
    })
    status?: NotificationStatus;
}
