import { NextApiHandler } from 'next';
import formidable from 'formidable';
import mime from 'mime';
import { parseForm } from 'lib/parseForm';
import { unlinkSync, rmSync } from 'fs';
import admZip from 'adm-zip';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { NotionLoader } from 'langchain/document_loaders/fs/notion';
import { Document } from 'langchain/dist/document';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDocument: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') return;

  const { fields, files } = await parseForm(req);

  const file = files.file as formidable.File;

  const fileExt = mime.getExtension(file.mimetype || '');

  const docs = await (async () => {
    switch (fileExt) {
      case 'pdf': {
        const loader = new PDFLoader(file.filepath, {
          //@ts-ignore
          pdfjs: () => import('pdf-parse/lib/pdf.js/v1.10.100/build/pdf'),
        });
        return await loader.load();
      }
      case 'zip': {
        const zip = new admZip(file.filepath);
        const extractPath = `${process.cwd()}/public/notion/${file.originalFilename}`;

        return await new Promise<Document<Record<string, any>>[]>((resolve) => {
          zip.extractAllToAsync(extractPath, true, undefined, async () => {
            const notionLoader = new NotionLoader(extractPath);
            const doc = await notionLoader.load();
            await rmSync(extractPath, { recursive: true, force: true });
            resolve(doc);
          });
        });
      }
      default:
        throw new Error('file type not supported');
    }
  })();

  unlinkSync(file.filepath); //不要になったファイルを削除

  const splitter = new CharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 0 });

  const splitedDocs = await splitter.splitDocuments(docs);

  const vectorStore = await HNSWLib.fromDocuments(
    splitedDocs,
    new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
  );

  await vectorStore.save(`${process.cwd()}/public/vectorStore/${file.originalFilename?.replace(`.${fileExt}`, '')}`);

  res.status(200).send('dcoument uploaded.');
};

export default uploadDocument;
