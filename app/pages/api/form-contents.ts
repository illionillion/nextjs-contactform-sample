import mysql_connection from '@/lib/db/connection';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const connection = await mysql_connection();
    const result = await connection.query('SELECT * from contact_table');
    connection.end();
    console.log(result[0]);
    res.status(200).json({ message: '接続に成功しました。' , contents: result[0]});
  } catch (error) {
    res.status(405).json({
      message: '取得に失敗しました。',
      error: error,
    });
  }
}
