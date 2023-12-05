import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { LikeService } from '../like/like.service';
// import { Post } from 'src/post/post.entity';
import { CreateCommentDto } from './comment.dto';
import { RequestWithUser } from 'src/middleware/token.middleware';
import { CreateCommentLikeDto } from '../like/like.dto';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly likeService: LikeService,
  ) {}

  @Get('comment/:postId')
  async getCommentByPost(postId: string) {
    return this.commentService.findCommentByPost(postId);
  }

  @Post()
  async addComment(@Body() comment: CreateCommentDto) {
    return this.commentService.createComment(comment);
  }

  @Get('/')
  async getAll() {
    const comments = await this.commentService.findAll();
    return { comments };
  }

  // Likes:

  @Get(':commentId/likes')
  async getLikesForComment(@Param('commentId') commentId: string) {
    const likes = await this.likeService.findLikesForComment(commentId);
    return { likes };
  }

  @Post(':commentId/likes')
  async likeComment(
    @Param('commentId') commentId: string,
    @Req() req: RequestWithUser,
  ) {
    const user = req.userEntity;
    const createCommentLikeDto = new CreateCommentLikeDto(
      user.user_id,
      commentId,
    );
    const like = await this.likeService.likeComment(createCommentLikeDto);
    return { like };
  }

  @Delete(':commentId/likes')
  async unlikeComment(
    @Param('commentId') commentId: string,
    @Req() req: RequestWithUser,
  ) {
    const user = req.userEntity;
    const createCommentLikeDto = new CreateCommentLikeDto(
      user.user_id,
      commentId,
    );
    const unlike = await this.likeService.unlikeComment(createCommentLikeDto);
    return { unlike };
  }
}
