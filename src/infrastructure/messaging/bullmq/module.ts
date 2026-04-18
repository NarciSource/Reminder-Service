import { Module } from "@nestjs/common";

import BullMQConnectionProvider, { BULLMQ_WORKER } from "./provider";

@Module({
    providers: [BullMQConnectionProvider],
    exports: [BULLMQ_WORKER],
})
export default class BullMQModule {}
