import { BadRequestException } from '@nestjs/common';

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  const currentExtension = file.mimetype.split('/')[1];
  const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp'];

  if (allowedExtensions.includes(currentExtension)) {
    return callback(null, true);
  }

  callback(
    new BadRequestException(
      `Extensión de imagen no permitida. Solo se permiten: ${allowedExtensions.join(', ')}.`,
    ),
    false,
  );
};
