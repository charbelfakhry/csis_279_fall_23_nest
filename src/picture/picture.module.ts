import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { userProviders } from '../user/user.providers';
import { PictureController } from './picture.controller';
import { pictureProviders } from './picture.providers';
import { PictureService } from './picture.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PictureController],
  providers: [PictureService, ...pictureProviders, ...userProviders],
})
export class PictureModule {}
