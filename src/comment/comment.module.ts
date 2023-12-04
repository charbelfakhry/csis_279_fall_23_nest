import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { commentProviders } from './comment.providers';
import { userProviders } from 'src/user/user.providers';
import { postProviders } from 'src/post/post.providers';
import { DatabaseModule } from '../database.module';
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CommentController],
  providers: [
    CommentService, 
    ...commentProviders,
    UserService,
    ...userProviders,
    PostService,
    ...postProviders
  ],

})
export class CommentModule { }