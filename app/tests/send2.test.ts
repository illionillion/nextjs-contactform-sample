import handler from "@/pages/api/send";
import { NextApiRequest, NextApiResponse } from "next";
import httpMocks from "node-mocks-http";

describe("hello API Test", () => {
  test("正しくJohn Doeが返されるか", async () => {
    const req = httpMocks.createRequest<NextApiRequest>({
      method: "POST",
      body: {
        name: "John Doe",
        email: "sample@email.com",
        content_question: "Hello World."
      },
    })
    const res = httpMocks.createResponse<NextApiResponse>()

    await handler(req, res)
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData().message).toEqual("送信に成功しました。");

  });
});
