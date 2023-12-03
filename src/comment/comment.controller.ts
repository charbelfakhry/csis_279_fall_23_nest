import { Controller, Get } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/')
  async getAll() {
    const comments = await this.commentService.findAll();
    return { comments };
  }
}