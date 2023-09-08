import mysql_connection from "@/lib/db/connection";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const connection = await mysql_connection();

      const query = `INSERT INTO contact_table (name, email, content_question) VALUES (?, ?, ?)`;
      await connection.execute(query, [
        req.body?.name,
        req.body?.email,
        req.body?.content_question,
      ]);

      res.status(200).json({ message: "送信に成功しました。" });
    } catch (error) {
      res.status(500).json({ message: "送信に失敗しました。", error: error });
    }
  } else {
    res
      .status(405)
      .json({
        message: "送信に失敗しました。",
        error: "POSTメソッドのみ許可されます。",
      });
  }
}
