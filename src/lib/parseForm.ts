import type { NextApiRequest } from 'next';
import formidable from 'formidable';
import mime from 'mime';
import { existsSync, mkdirSync, statSync } from 'fs';
import { join } from 'path';

export const FormidableError = formidable.errors.FormidableError;

export const parseForm = async (
  req: NextApiRequest,
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise(async (resolve, reject) => {
    const uploadDir = join(process.env.UPLOAD_DIR || process.cwd(), `/public/uploads`);

    try {
      await statSync(uploadDir);
    } catch (e: any) {
      if (e.code === 'ENOENT') {
        await mkdirSync(uploadDir, { recursive: true });
      } else {
        reject(e);
        return;
      }
    }

    const form = formidable({
      uploadDir,
      filename: (_name, _ext, part) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const fileName = `${part.name}-${uniqueSuffix}.${mime.getExtension(part.mimetype || '')}`;
        return fileName;
      },
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};
