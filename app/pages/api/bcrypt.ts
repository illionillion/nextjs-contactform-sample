import bcrypt from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';

const saltRounds = 10; // ハッシュ化のコストファクター

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const password = req.query.password as string;
    
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    res.status(200).json({
      message: '成功',
      hashed: hashedPassword
    });
  } catch (error) {
    res.status(405).json({
      message: '失敗しました。',
      error: error,
    });
  }
}
