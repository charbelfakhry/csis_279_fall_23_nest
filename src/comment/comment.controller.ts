import { Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { CommentService } from './comment.service';
import { LikeService } from '../like/like.service';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService, 
    private readonly likeService: LikeService,
  ) {}

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
   async likeComment(@Param('commentId') commentId: string) {
     const like = await this.likeService.likeComment(commentId);
     return { like };
   }
 
   @Delete(':commentId/likes')
   async unlikeComment(@Param('commentId') commentId: string) {
     const unlike = await this.likeService.unlikeComment(commentId);
     return { unlike };
   }
}

 
