import { Controller, Get } from '@nestjs/common';
import { PictureService } from './picture.service';

@Controller('pictures')
export class PictureController {
  constructor(private readonly pictureService: PictureService) {}

  @Get('/')
  async getAll() {
    const pictures = await this.pictureService.findAll();
    return { pictures };
  }
}
