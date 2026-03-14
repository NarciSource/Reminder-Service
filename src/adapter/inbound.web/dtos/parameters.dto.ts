import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString, ValidateIf } from "class-validator";

import { NotificationStatus } from "@/domain/model/entity";
import { AtLeastOneOption, IsTimeRange, TrimSeconds } from "../decorators";

export default class ParametersDTO {
    @IsDate()
    @IsOptional()
    @ValidateIf((o) => o.end_time) // end_time과 엮음
    @Type(() => Date)
    @TrimSeconds()
    @ApiProperty({
        description: "시작 시간",
        required: false,
        example: "2024-12-01T00:00:00+09:00",
    })
    start_time?: Date;

    @IsDate()
    @IsOptional()
    @ValidateIf((o) => o.start_time) // start_time과 엮음
    @Type(() => Date)
    @TrimSeconds()
    @ApiProperty({
        description: "종료 시간",
        required: false,
        example: "2024-12-05T00:00:00+09:00",
    })
    end_time?: Date;

    @IsTimeRange({ message: "시작 시간과 종료 시간은 짝으로 제공되거나 없어야합니다." })
    time_range?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: "알림 상태",
        enum: NotificationStatus,
        required: false,
        example: "Pending",
    })
    status?: NotificationStatus;

    @AtLeastOneOption({ message: "적어도 하나의 옵션이 필요합니다." })
    filter_options?: any;
}
