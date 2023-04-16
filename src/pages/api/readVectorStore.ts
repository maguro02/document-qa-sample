import { NextApiHandler } from 'next';

const readVectorStore: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') return;

  res.status(200).send('OK');
};

export default readVectorStore;
