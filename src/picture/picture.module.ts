import { Module } from '@nestjs/common';
import { PictureController } from './picture.controller';
import { PictureService } from './picture.service';
import { pictureProviders } from './picture.providers';
import { DatabaseModule } from '../database.module';
import { userProviders } from '../user/user.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [PictureController],
  providers: [PictureService, ...pictureProviders, ...userProviders],
})
export class PictureModule {}
