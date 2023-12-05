import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { postProviders } from './post.providers';
import { DatabaseModule } from '../database.module';
import { LikeService } from '../like/like.service';
import { likeProviders } from '../like/like.providers';
import { UserService } from '../user/user.service';
import { userProviders } from '../user/user.providers';
import { commentProviders } from '../comment/comment.providers';
import { CommentService } from '../comment/comment.service';
import { PictureService } from '../picture/picture.service';
import { pictureProviders } from '../picture/picture.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [PostController],
  providers: [
    PostService,
    ...postProviders,
    PictureService,
    ...pictureProviders,
    UserService,
    ...userProviders,
    LikeService,
    ...likeProviders,
    CommentService,
    ...commentProviders,
  ],
})
export class PostModule {}
