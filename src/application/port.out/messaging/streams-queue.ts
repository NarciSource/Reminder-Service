export type StreamMessage<T> = {
    payload: T;
    ack: () => Promise<void>;
};

export abstract class StreamsQueue {
    abstract push<T>(payload: T): Promise<void>;

    abstract consume<T>(): AsyncGenerator<StreamMessage<T>>;
}
