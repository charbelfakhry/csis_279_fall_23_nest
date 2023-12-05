import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { PostController } from '../post/post.controller';
import { CommentController } from '../comment/comment.controller';
import { likeProviders } from './like.providers';
import { LikeService } from './like.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PostController, CommentController],
  providers: [LikeService, ...likeProviders],
})
export class LikeModule {}
