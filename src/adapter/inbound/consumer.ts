import { Inject, Injectable, type OnApplicationBootstrap, type OnApplicationShutdown } from "@nestjs/common";
import type { CommandBus } from "@nestjs/cqrs";
import type { Processor, Worker } from "bullmq";

import { RunCommand } from "@/application/commands";
import { BULLMQ_WORKER } from "@/infrastructure/messaging/bullmq";

@Injectable()
export class ConsumerService implements OnApplicationBootstrap, OnApplicationShutdown {
    private readonly queueName = "reminder-delay-queue";
    private worker: Worker;

    constructor(
        private readonly commandBus: CommandBus,
        @Inject(BULLMQ_WORKER)
        private readonly createWorker: (queueName: string, processor: Processor) => Worker,
    ) {}

    onApplicationBootstrap() {
        this.worker = this.createWorker(this.queueName, async (job) => {
            const command = new RunCommand(job);

            await this.commandBus.execute(command);
        });

        this.worker.run();
    }

    async onApplicationShutdown() {
        await this.worker.close();
    }
}
