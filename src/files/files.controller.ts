import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/file-filter.helper';
import { diskStorage } from 'multer';
import { fileName } from './helpers/file-name.helper';
import { type Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('profile-photo/:imageName')
  findProfilePhoto(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticImageName(imageName);
    res.sendFile(path);
  }

  @Post('profile-photo')
  @UseInterceptors(
    FileInterceptor('profilePhoto', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './static/uploads',
        filename: fileName,
      }),
    }),
  )
  uploadProfilePhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No se envió ningún archivo');

    const apiBaseUrl = this.configService.get<string>('apiBaseUrl');
    const secureUrl = `${apiBaseUrl}/files/profile-photo/${file.filename}`;

    return { secureUrl };
  }
}
