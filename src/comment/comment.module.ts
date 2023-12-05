import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { postProviders } from '../post/post.providers';
import { PostService } from '../post/post.service';
import { userProviders } from '../user/user.providers';
import { UserService } from '../user/user.service';
import { CommentController } from './comment.controller';
import { commentProviders } from './comment.providers';
import { CommentService } from './comment.service';
import { likeProviders } from '../like/like.providers';
import { LikeService } from '../like/like.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CommentController],
  providers: [
    CommentService,
    ...commentProviders,
    UserService,
    ...userProviders,
    PostService,
    ...postProviders,
    LikeService,
    ...likeProviders,
  ],
})
export class CommentModule {}
