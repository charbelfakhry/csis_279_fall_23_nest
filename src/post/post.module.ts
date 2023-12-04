import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { postProviders } from './post.providers';
import { DatabaseModule } from '../database.module';
import { pictureProviders } from '../picture/picture.providers';
import { PictureService } from '../picture/picture.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PostController],
  providers: [
    PostService,
    PictureService,
    ...postProviders,
    ...pictureProviders,
  ],
})
export class PostModule {}
