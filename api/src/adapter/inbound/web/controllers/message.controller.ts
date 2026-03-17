import { Controller, Get, Patch } from "@nestjs/common";
// biome-ignore lint/style/useImportType: NestJS DI requires runtime class reference
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MessagePattern } from "@nestjs/microservices";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";

import { UpdateCommand } from "@/application/commands";
import { ListQuery } from "@/application/queries";
import { PayloadEX } from "../decorators";
import { ParametersDTO, UpdateRequestDTO } from "../dtos";

@Controller("/docs")
@ApiTags("TCP API")
export default class MessageController {
    constructor(
        private readonly query_bus: QueryBus,
        private readonly command_bus: CommandBus,
    ) {}

    @Get()
    @ApiOperation({
        summary: "알림 옵션 조회",
        description: "이 API는 메시지 브로커를 통해 동작하며, HTTP 요청으로는 사용되지 않습니다.",
    })
    @ApiBody({ type: ParametersDTO })
    @MessagePattern({ cmd: "readByOptions" })
    async readByOptions(@PayloadEX(ParametersDTO) payload: ParametersDTO) {
        const query = new ListQuery(payload.start_time, payload.end_time, payload.status);

        return this.query_bus.execute(query);
    }

    @Patch()
    @ApiOperation({
        summary: "알림 부분 수정",
        description: "이 API는 메시지 브로커를 통해 동작하며, HTTP 요청으로는 사용되지 않습니다.",
    })
    @ApiBody({ type: UpdateRequestDTO })
    @MessagePattern({ cmd: "updatePartial" })
    async updatePartial(@PayloadEX(UpdateRequestDTO) payload: UpdateRequestDTO) {
        const command = new UpdateCommand(payload.event_id, payload.send_at, payload.status);

        return this.command_bus.execute(command);
    }
}
