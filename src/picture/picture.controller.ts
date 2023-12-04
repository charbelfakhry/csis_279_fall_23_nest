import {
  Controller,
  Get,
  Logger,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PictureService } from './picture.service';

@Controller('pictures')
export class PictureController {
  private readonly logger = new Logger(PictureController.name);
  constructor(private readonly pictureService: PictureService) {}

  @Post('profile')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }]))
  changeUserProfile(@UploadedFiles() file: { avatar?: Express.Multer.File[] }) {
    this.logger.debug(file);
  }

  @Get('/')
  async getAll() {
    const pictures = await this.pictureService.findAll();
    return { pictures };
  }
}
