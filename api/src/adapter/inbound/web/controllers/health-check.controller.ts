import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
// biome-ignore lint/style/useImportType: NestJS DI requires runtime class reference
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";

@Controller("/health")
@ApiTags("Health Check")
export default class HealthCheckController {
    constructor(private readonly health: HealthCheckService) {}

    @Get()
    @ApiOperation({ summary: "헬스 체크" })
    @HealthCheck()
    check() {
        return this.health.check([]);
    }
}
