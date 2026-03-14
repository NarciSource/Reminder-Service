import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
// biome-ignore lint/style/useImportType: NestJS DI requires runtime class reference
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiExtraModels, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { DeleteCommand, RegisterCommand, ReplaceCommand, UpdateCommand } from "@/application/commands";
import { GetQuery, ListQuery } from "@/application/queries";
import { type CreateRequestDTO, ParametersDTO, ReadRequestDTO, type UpdateRequestDTO } from "../dtos";

@Controller("/")
@ApiTags("HTTP API")
@ApiResponse({ status: 401, description: "권한 없음" })
@ApiResponse({ status: 400, description: "입력 값 오류" })
export default class HttpController {
    constructor(
        private readonly query_bus: QueryBus,
        private readonly command_bus: CommandBus,
    ) {}

    @Post()
    @ApiOperation({ summary: "알림 등록" })
    @ApiResponse({ status: 201, description: "성공적으로 등록" })
    async create(@Body() dto: CreateRequestDTO) {
        const command = new RegisterCommand(dto.event_id, dto.send_at, dto.status);

        return this.command_bus.execute(command);
    }

    @Get(":event_id")
    @ApiOperation({ summary: "알림 조회" })
    @ApiResponse({ status: 200, description: "성공적으로 조회" })
    async read(@Param() dto: ReadRequestDTO) {
        const query = new GetQuery(dto.event_id);

        return this.query_bus.execute(query);
    }

    @Get()
    @ApiOperation({ summary: "알림 옵션 조회" })
    @ApiResponse({ status: 200, description: "성공적으로 조회" })
    @ApiExtraModels(ParametersDTO)
    async list(@Query() dto: ParametersDTO) {
        const query = new ListQuery(dto.start_time, dto.end_time, dto.status);

        return this.query_bus.execute(query);
    }

    @Put(":event_id")
    @ApiOperation({ summary: "알림 수정" })
    @ApiResponse({ status: 200, description: "성공적으로 수정" })
    async replace(@Param() paramDTO: ReadRequestDTO, @Body() bodyDTO: CreateRequestDTO) {
        const command = new ReplaceCommand(paramDTO.event_id, bodyDTO.send_at, bodyDTO.status);

        return this.command_bus.execute(command);
    }

    @Patch(":event_id")
    @ApiOperation({ summary: "알림 일부 수정" })
    @ApiResponse({ status: 200, description: "성공적으로 수정" })
    async update(@Param() paramDTO: ReadRequestDTO, @Body() bodyDTO: UpdateRequestDTO) {
        const command = new UpdateCommand(paramDTO.event_id, bodyDTO.send_at, bodyDTO.status);

        return this.command_bus.execute(command);
    }

    @Delete(":event_id")
    @ApiOperation({ summary: "알림 삭제" })
    @ApiResponse({ status: 200, description: "성공적으로 수정" })
    @ApiParam({ name: "event_id", type: ReadRequestDTO })
    async delete(@Param() dto: ReadRequestDTO) {
        const command = new DeleteCommand(dto.event_id);

        return this.command_bus.execute(command);
    }
}
