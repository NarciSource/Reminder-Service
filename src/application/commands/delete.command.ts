export default class DeleteCommand {
    /**
     * @param event_id - 알림이 할당된 이벤트의 ID
     */
    constructor(public readonly event_id: string) {}
}
