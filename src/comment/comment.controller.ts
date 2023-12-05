import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommentService } from '../comment/comment.service';
// import { Post } from 'src/post/post.entity';
import { CommentDto, CreateCommentDto } from './comment.dto';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':username/:postId/comments')
  async getCommentByPost(
    @Param('username') username: string,
    @Param('postId') postId: string,
  ): Promise<CommentDto[]> {
    return this.commentService.findCommentByPost(username, postId);
  }

  @Post(':username/:postId/comments')
  async addComment(
    @Param('username') username: string,
    @Param('postId') postId: string,
    @Body() comment: CreateCommentDto,
  ): Promise<CommentDto> {
    const createdComment = await this.commentService.createComment(
      username,
      postId,
      comment,
    );
    return {
      content: createdComment.content,
      username: createdComment.user.username,
      created_at: createdComment.created_at,
    };
  }

  @Put(':username/:postId/:commentId')
  async updateComment(
    @Param('username') username: string,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() comment: CreateCommentDto,
  ): Promise<CommentDto> {
    const createdComment = await this.commentService.updateComment(
      username,
      postId,
      commentId,
      comment,
    );
    if (!createdComment) throw new NotFoundException('Comment does not exist.');
    return {
      content: createdComment.content,
      username: createdComment.user.username,
      created_at: createdComment.created_at,
    };
  }

  @Get('/')
  async getAll() {
    const comments = await this.commentService.findAll();
    return { comments };
  }
}
