import axios from "axios";

import { OnesignalClient } from "./onesignal.client";

jest.mock("axios");

describe("OnesignalClient", () => {
    let client: OnesignalClient;
    let axiosCreateMock: jest.Mock;

    beforeEach(() => {
        axiosCreateMock = jest.fn().mockReturnValue({
            interceptors: {
                request: {
                    use: jest.fn(),
                },
            },
            post: jest.fn(),
        });
        (axios.create as jest.Mock) = axiosCreateMock;

        client = new OnesignalClient();
    });

    it("Axios 인스턴스를 올바르게 생성", () => {
        expect(axiosCreateMock).toHaveBeenCalledWith({
            baseURL: "https://api.onesignal.com/notifications",
            headers: {
                Authorization: process.env.ONESIGNAL_API_KEY,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
    });

    it("요청 인터셉터가 설정됨", () => {
        const interceptors = axiosCreateMock.mock.results[0].value.interceptors.request.use;
        expect(interceptors).toHaveBeenCalledTimes(1);

        const interceptorCallback = interceptors.mock.calls[0][0];
        const config = { method: "post", data: { key: "value" } };
        const modifiedConfig = interceptorCallback(config);

        expect(modifiedConfig.data).toEqual({
            key: "value",
            app_id: process.env.ONESIGNAL_APP_ID,
        });
    });

    it("post 메서드가 Axios 인스턴스의 post 메서드를 반환", () => {
        const postMethod = client.post;
        expect(postMethod).toBe(axiosCreateMock.mock.results[0].value.post);
    });
});
