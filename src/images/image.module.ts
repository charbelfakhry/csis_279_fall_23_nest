import { Module } from '@nestjs/common';
import { ImageService } from './image.service';

@Module({
  controllers: [],
  providers: [ImageService],
})
export class ImageModule {}
