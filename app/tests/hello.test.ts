import handler from "@/pages/api/hello";
import { NextApiRequest, NextApiResponse } from "next";
import httpMocks from "node-mocks-http";

describe("hello API Test", () => {
  test("正しくJohn Doeが返されるか", async () => {
    const req = httpMocks.createRequest<NextApiRequest>({
      query: {
        keyword: 'test',
      },
    })
    const res = httpMocks.createResponse<NextApiResponse>()

    await handler(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._getJSONData().name).toBe("John Doe")
  });
});
