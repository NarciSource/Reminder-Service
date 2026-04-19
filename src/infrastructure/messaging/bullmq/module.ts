import { Module } from "@nestjs/common";

import BullMQConnectionProvider from "./provider";

@Module({
    providers: [BullMQConnectionProvider],
})
export default class BullMQModule {}
