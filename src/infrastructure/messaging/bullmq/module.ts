import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";

import BullMQConnectionProvider from "./provider";

@Module({
    imports: [
        BullModule.forRootAsync(BullMQConnectionProvider),

        BullModule.registerQueue({
            name: "reminder-delay-queue",
        }),
    ],
    exports: [BullModule],
})
export default class BullMQModule {}
