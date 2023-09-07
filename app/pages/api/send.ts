import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

type RequestData = {
  name: string;
  email: string;
  emailcontent_question: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  console.log(req.body);

  res.status(200).json({ message: "OK!!" });
}
