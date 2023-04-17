import { NextApiHandler } from 'next';
import formidable from 'formidable';
import { parseForm } from 'lib/parseForm';
import { unlinkSync } from 'fs';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDocument: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') return;

  const { fields, files } = await parseForm(req);

  const file = files.file as formidable.File;

  //@ts-ignore
  const loader = new PDFLoader(file.filepath, { pdfjs: () => import('pdf-parse/lib/pdf.js/v1.10.100/build/pdf') });

  const docs = await loader.load();

  unlinkSync(file.filepath); //不要になったファイルを削除

  const vectorStore = await HNSWLib.fromDocuments(
    docs,
    new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
  );

  await vectorStore.save(`${process.cwd()}/public/vectorStore/${file.newFilename}`);

  res.status(200).send('dcoument uploaded.');
};

export default uploadDocument;
