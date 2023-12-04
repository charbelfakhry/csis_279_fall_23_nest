import { Controller, Get, Post } from '@nestjs/common';
import { CommentService } from '../comment/comment.service';
// import { Post } from 'src/post/post.entity';
import { CreateCommentDto } from './comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('comment/:postId')
  async getCommentByPost(postId: string) {
    return this.commentService.findCommentByPost(postId);
  }

  @Post()
  async addComment(comment: CreateCommentDto) {
    return this.commentService.createComment(comment);
  }

  @Get('/')
  async getAll() {
    const comments = await this.commentService.findAll();
    return { comments };
  }
}
