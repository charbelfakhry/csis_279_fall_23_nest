import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { RequestWithUser } from 'src/middleware/token.middleware';
import { CreatePostRequestDTO, CreatePostResponseDTO } from './post.dto';
import { Post as PostEntity } from './post.entity';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  private readonly logger = new Logger(PostController.name);
  constructor(private readonly postService: PostService) {}

  /**
   * Get all posts
   * @returns Array of PostEntity objects
   */
  @Get()
  async findAll(): Promise<PostEntity[]> {
    return this.postService.findAll();
  }

  /**
   * Get posts by user ID
   * @param userId - ID of the user
   * @returns Array of PostEntity objects
   */
  @Get(':user_id')
  async findByUserId(@Param('user_id') userId: string): Promise<PostEntity[]> {
    return this.postService.findByUserId(userId);
  }

  /**
   * Create a new post
   * @param postData - Partial data of PostEntity
   * @param request
   * @returns Created PostEntity object
   */

  @Post()
  async createPost(
    @Body() postData: Partial<CreatePostRequestDTO>,
    @Req() request: RequestWithUser,
  ): Promise<CreatePostResponseDTO> {
    const user = request.userEntity;
    const post = await this.postService.createPost(postData, user);

    return {
      content: post.content,
      picture: post.postPicture?.picture_url,
      post_id: post.post_id,
    };
  }

  /**
   * Update a post by ID
   * @param postId - ID of the post to update
   * @param updateData - Partial data of PostEntity for update
   * @param req
   * @returns Updated PostEntity object
   */
  @Put(':post_id')
  async updatePost(
    @Param('post_id') postId: string,
    @Body() updateData: Partial<CreatePostRequestDTO>,
    @Req() req: RequestWithUser,
  ): Promise<PostEntity> {
    const user = req.userEntity;

    const updatedPost = await this.postService.updatePost(
      postId,
      user,
      updateData,
    );

    if (!updatedPost) {
      throw new NotFoundException('Post not found');
    }
    return updatedPost;
  }

  /**
   * Delete a post by ID
   * @param postId - ID of the post to delete
   * @param request
   */
  @Delete(':post_id')
  async deletePost(
    @Param('post_id') postId: string,
    @Req() request: RequestWithUser,
  ): Promise<void> {
    const user = request.userEntity;
    try {
      await this.postService.deletePost(postId, user);
    } catch (error) {
      this.logger.fatal(error);
      throw new NotFoundException('Post not found');
    }
  }

  /**
   * Get posts by user name
   * @param userName - User name to search for
   * @returns Array of PostEntity objects
   */
  @Get('user/:userName')
  async findPostsByUserName(
    @Param('userName') userName: string,
  ): Promise<PostEntity[]> {
    const posts = await this.postService.findPostsByUserName(userName);
    if (!posts || posts.length === 0) {
      throw new NotFoundException('No posts found for this user name');
    }
    return posts;
  }
}
