import handler from '@/pages/api/send';
import http, { IncomingMessage, ServerResponse } from 'http';
// nextjsのバージョンが12.1.0より前なら以下のimport
import { apiResolver } from "next/dist/server/api-utils/node";
import request from 'supertest';

describe('送信APIのテスト', () => {
  let server: http.Server;
  const mockedApiPreviewProps = {
    previewModeId: '',
    previewModeEncryptionKey: '',
    previewModeSigningKey: '',
  };
  // サーバで受け取るリクエストの処理
  const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
    if (typeof req.url !== 'string') {
      throw 'error';
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
  test('API ROUTEのテスト POST', async () => {
    const agent = await request
      .agent(server)
      .post('/api/send')
      .send({ name: "John Doe", email: "sample@email.com", content_question: "Hello World." });
    expect(agent.status).toEqual(200);
    expect(agent.body.message).toEqual("送信に成功しました。");
  });
});

