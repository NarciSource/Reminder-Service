import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";

@Controller("/health")
@ApiTags("Health Check")
export default class HealthCheckController {
    constructor(private health: HealthCheckService) {}

    @Get()
    @ApiOperation({ summary: "헬스 체크" })
    @HealthCheck()
    check() {
        return this.health.check([]);
    }
}
