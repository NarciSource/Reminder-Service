import type { Job } from "bullmq";

export default class RunCommand {
    constructor(public readonly job: Job) {}
}
