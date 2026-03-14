import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export default class ReadRequestDTO {
    @IsString()
    @ApiProperty({ description: "수행될 이벤트 ID", example: "507f1f77bcf86cd799439011" })
    event_id: string;
}
