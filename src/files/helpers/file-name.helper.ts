import { v4 as uuid } from 'uuid';

export const fileName = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  const currentExtension = file.mimetype.split('/')[1];
  const fileName = `${uuid()}.${currentExtension}`;
  callback(null, fileName);
};
