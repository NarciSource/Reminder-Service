import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import type { CommandBus } from "@nestjs/cqrs";
import type { Job } from "bullmq";

import { RunCommand } from "@/application/commands";

@Injectable()
@Processor("reminder-delay-queue", { concurrency: 10 })
export class ConsumerService extends WorkerHost {
    constructor(private readonly commandBus: CommandBus) {
        super();
    }

    async process(job: Job) {
        const command = new RunCommand(job);

        await this.commandBus.execute(command);
    }
}
