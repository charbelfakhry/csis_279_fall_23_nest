import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Req,
} from '@nestjs/common';
import { LikeService } from '../like/like.service';
import { PostService } from './post.service';


@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly likeService: LikeService,
  ) {}

  @Get('/')
  async getAll() {
    const posts = await this.postService.findAll();
    return { posts };
  }

  //Likes:

  @Get(':postId/likes')
  async getLikesForPost(@Param('postId') postId: string) {
    const likes = await this.likeService.findLikesForPost(postId);
    return { likes };
  }

  @Post(':postId/likes')
  async likePost(@Param('postId') postId: string, @Req() req: RequestWithUser) {
    // const user = 
    const like = await this.likeService.likePost(user, postId);
    return { like };
  }

  @Delete(':postId/likes')
  async unlikePost(@Param('postId') postId: string) {
    // const user = 
    const unlike = await this.likeService.unlikePost(user, postId);
    return { unlike };
  }
}
