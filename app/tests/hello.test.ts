import handler from "@/pages/api/hello";
import http, { IncomingMessage, ServerResponse } from "http";
import { apiResolver } from "next/dist/server/api-utils/node";
import request from "supertest";

describe("hello API Test", () => {
  let server: http.Server;
  const mockedApiPreviewProps = {
    previewModeId: "",
    previewModeEncryptionKey: "",
    previewModeSigningKey: "",
  };
  // サーバで受け取るリクエストの処理
  const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
    if (typeof req.url !== "string") {
      throw "error";
    }
    const url = new URL(`http://localhost${req.url}`); // URLの形式に合わせる
    const query = Object.fromEntries(url.searchParams); // クエリパラメータを連想配列に変換
    return apiResolver(req, res, query, handler, mockedApiPreviewProps, false);
  };
  beforeAll(() => {
    // サーバ作成
    server = http.createServer(requestHandler);
  });
  afterAll(() => {
    // サーバ停止
    server.close();
  });
  test("正しくJohn Doeが返されるか", async () => {
    const agent = await request.agent(server).get("/api/hello");
    expect(agent.status).toEqual(200);
    expect(agent.body.name).toEqual("John Doe");
  });
});
