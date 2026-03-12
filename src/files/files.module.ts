import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { cloudinaryStorage } from 'src/config';

@Module({
  imports: [
    /**
     * Multer es la librería que maneja la subida de archivos (multipart/form-data)
     * cuando un cliente envía imágenes o archivos al backend.
     */
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        /**
         * "storage" define dónde se guardarán los archivos subidos.
         * En lugar de guardarlos en el disco local, aquí usamos Cloudinary.
         * cloudinaryStorage(configService) crea una instancia de almacenamiento
         * configurada con las credenciales de Cloudinary.
         */
        storage: cloudinaryStorage(configService),
      }),
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService, ConfigService],
})
export class FilesModule {}
