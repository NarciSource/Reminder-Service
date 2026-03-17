import { Injectable } from "@nestjs/common";
import { ClientTCP } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

import { ReminderClient } from "@/application/port.out/api";

/**
 * 마이크로서비스와 TCP 연결을 관리하고 요청을 처리하는 역할을 합니다.
 */
@Injectable()
export default class TcpReminderClient extends ReminderClient {
    private client: ClientTCP;

    constructor() {
        super();

        // 마이크로서비스 TCP 연결
        this.client = new ClientTCP({
            host: process.env.MS_HOST || "localhost", // Reminder-Api 서비스의 호스트
            port: process.env.MS_PORT || 3001, // Reminder-Api 서비스의 포트
        });

        // 연결 에러 처리
        this.client.handleError = (error) => {
            console.error("Connection error", error);
            this.isConnected = false;
        };
    }

    /**
     * 모듈 초기화 시 호출되며, 클라이언트 연결을 시도합니다.
     */
    async onModuleInit(): Promise<void> {
        await this.connectClient();
    }

    /**
     * 클라이언트가 연결 상태인지 확인하고, 연결이 끊어진 경우 재연결을 시도합니다.
     * @returns 연결이 보장되면 resolve되는 Promise
     */
    public async ensureConnected(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (this.isConnected) {
                resolve();
            }

            const iv = setInterval(
                async () => {
                    if (await this.connectClient()) {
                        clearInterval(iv);
                        resolve();
                    }
                },
                1000 * 60 * 10, // 10분마다 연결 확인
            );
        });
    }

    /**
     * 클라이언트 연결을 시도합니다.
     * 연결이 성공하면 `isConnected` 플래그를 true로 설정합니다.
     * @returns 연결 성공 여부를 나타내는 boolean 값
     */
    async connectClient(): Promise<boolean> {
        if (this.isConnected) {
            return true;
        }

        try {
            console.log(`Trying to connect... ${this.client["host"]}:${this.client["port"]}`);
            await this.client.connect();
            console.log("Connected successfully!");
            this.isConnected = true;
        } catch (error) {
            console.error("Connection failed. Retrying in 10 minutes...", error);
        }
        return this.isConnected;
    }

    /**
     * 주어진 쿼리를 기반으로 마이크로서비스에서 데이터를 읽어옵니다.
     * @param query 데이터를 읽기 위한 옵션 쿼리
     * @returns 마이크로서비스에서 반환된 데이터
     */
    async readByOptions(query: any): Promise<any> {
        return firstValueFrom(this.client.send({ cmd: "readByOptions" }, query));
    }

    /**
     * 주어진 쿼리를 기반으로 마이크로서비스에서 데이터를 부분적으로 업데이트합니다.
     * @param query 데이터를 업데이트하기 위한 옵션 쿼리
     * @returns 마이크로서비스에서 반환된 결과
     */
    async updatePartial(query: any): Promise<any> {
        return firstValueFrom(this.client.send({ cmd: "updatePartial" }, query));
    }
}
