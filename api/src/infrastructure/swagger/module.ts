import { Module } from "@nestjs/common";

import { swaggerConfigProvider } from "./provider";
import { SwaggerService } from "./service";

@Module({
    providers: [swaggerConfigProvider, SwaggerService],
    exports: [SwaggerService],
})
export default class SwaggerModule {}
