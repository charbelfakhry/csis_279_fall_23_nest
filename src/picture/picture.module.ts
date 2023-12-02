import { Module } from '@nestjs/common';
import { PictureController } from './picture.controller';
import { PictureService } from './picture.service';
import { pictureProviders } from './picture.providers';
import { DatabaseModule } from '../database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PictureController],
  providers: [PictureService, ...pictureProviders],
})
export class PictureModule {}
