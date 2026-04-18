import { Module } from "@nestjs/common";

import BullMQConnectionProvider, { BULLMQ_QUEUE } from "./provider";

@Module({
    providers: [BullMQConnectionProvider],
    exports: [BULLMQ_QUEUE],
})
export default class BullMQModule {}
