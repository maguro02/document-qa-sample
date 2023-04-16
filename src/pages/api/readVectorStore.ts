import { readdirSync } from 'fs';
import { NextApiHandler } from 'next';

const readVectorStore: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') return;

  const vectorStores = await readdirSync('public/vectorStore');

  console.log(vectorStores);
};

export default readVectorStore;
