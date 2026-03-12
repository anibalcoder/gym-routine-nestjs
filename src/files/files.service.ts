import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

export type CloudinaryUploadResult = UploadApiResponse;

@Injectable()
export class FilesService {
  async deleteImage(publicId: string): Promise<any> {
    try {
      const result = (await cloudinary.uploader.destroy(publicId)) as string;
      return result;
    } catch {
      throw new BadRequestException('Error al eliminar la imagen');
    }
  }
}
