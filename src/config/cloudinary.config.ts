import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

export const cloudinaryConfig = (configService: ConfigService) => {
  cloudinary.config({
    cloud_name: configService.get<string>('cloudinaryCloudName'),
    api_key: configService.get<string>('cloudinaryApiKey'),
    api_secret: configService.get<string>('cloudinaryApiSecret'),
  });

  return cloudinary;
};

export const cloudinaryStorage = (configService: ConfigService) => {
  return new CloudinaryStorage({
    cloudinary: cloudinaryConfig(configService),
    params: () => ({
      /**
       * Carpeta dentro de Cloudinary donde se almacenará la imagen
       * En Cloudinary aparecerá como: gym-routine/profile-images/archivo.jpg
       */
      folder: 'gym-routine/profile-images',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [
        /**
         * Limita el tamaño máximo de la imagen a 500x500
         * crop: 'limit' mantiene proporción sin recortar
         */
        { width: 300, height: 300, crop: 'limit' },
        /**
         * Optimiza automáticamente la calidad de la imagen
         * reduce peso manteniendo buena calidad
         */
        { quality: 'auto:good' },
        /**
         * Convierte automáticamente el formato al más eficiente
         * por ejemplo: webp o avif dependiendo del navegador
         */
        { fetch_format: 'auto' },
      ],
    }),
  });
};
