import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

import { ReminderStatus } from "@/domain/model/entity";

export default class UpdateRequestDTO {
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "수행될 이벤트 ID", example: "507f1f77bcf86cd799439011" })
    event_id: string;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    @ApiProperty({ description: "알림 발송 시간", required: false })
    send_at?: Date;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: "알림 상태",
        enum: ReminderStatus,
        required: false,
        example: "Pending",
    })
    status?: ReminderStatus;
}
