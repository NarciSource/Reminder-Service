export default abstract class ReminderSource {
    abstract getReady(now: Date): Promise<string[]>;
}
