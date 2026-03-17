import { Module } from "@nestjs/common";

import DynamoModel from "./model";
import DynamoProvider from "./provider";

@Module({
    providers: [DynamoProvider, DynamoModel],
    exports: [DynamoModel],
})
export default class DynamoModule {}
