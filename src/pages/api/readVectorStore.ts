import { readdirSync } from 'fs';
import { NextApiHandler } from 'next';

const readVectorStore: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') return;

  const vectorStores = await readdirSync('public/vectorStore');

  res.status(200).json(vectorStores);
};

export default readVectorStore;
