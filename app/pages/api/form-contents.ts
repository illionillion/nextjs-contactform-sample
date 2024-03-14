import mysql_connection from '@/lib/db/connection';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let connection;
  try {
    connection = await mysql_connection();
    const result = await connection.query('SELECT * from contact_table');
    console.log(result[0]);
    res.status(200).json({ message: '接続に成功しました。' , contents: result[0]});
  } catch (error) {
    res.status(405).json({
      message: '取得に失敗しました。',
      error: error,
    });
  } finally {
    if(connection) connection.end();
  }
}
