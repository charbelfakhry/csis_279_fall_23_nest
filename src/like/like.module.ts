import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { PostController } from '../post/post.controller';
import { CommentController } from '../comment/comment.controller';
import { likeProviders } from './like.providers';
import { LikeService } from './like.service';
import { commentProviders } from '../comment/comment.providers';
import { userProviders } from '../user/user.providers';
import { postProviders } from '../post/post.providers';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';
import { CommentService } from '../comment/comment.service';
import { PictureService } from '../picture/picture.service';
import { pictureProviders } from '../picture/picture.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [PostController, CommentController],
  providers: [
    LikeService,
    ...likeProviders,
    CommentService,
    ...commentProviders,
    PictureService,
    ...pictureProviders,
    UserService,
    ...userProviders,
    PostService,
    ...postProviders,
  ],
})
export class LikeModule {}
