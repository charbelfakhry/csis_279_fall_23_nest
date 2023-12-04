import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostEntity } from './post.entity';
import { request } from 'http';
import { RequestWithUser } from 'src/middleware/token.middleware';
import { CreatePostDTO } from './post.dto';

@Controller('posts')
export class PostController {
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
   * @returns Created PostEntity object
   */

  @Post()
  async createPost(@Body() postData: Partial<CreatePostDTO>, @Req() request: RequestWithUser): Promise<PostEntity> {
    const user = request.user;
    
    return this.postService.createPost(postData, user);
  }

  /**
   * Update a post by ID
   * @param postId - ID of the post to update
   * @param updateData - Partial data of PostEntity for update
   * @returns Updated PostEntity object
   */
  @Put(':post_id')
  async updatePost(@Param('post_id') postId: string, @Body() updateData: Partial<PostEntity>): Promise<PostEntity> {
    const updatedPost = await this.postService.updatePost(postId, updateData);
    if (!updatedPost) {
      throw new NotFoundException('Post not found');
    }
    return updatedPost;
  }

  /**
   * Delete a post by ID
   * @param postId - ID of the post to delete
   */
  @Delete(':post_id')
  async deletePost(@Param('post_id') postId: string, @Req() request: RequestWithUser): Promise<void> {
    const user = request.user;
    try {
      await this.postService.deletePost(postId, user);
    } catch (error) {
      throw new NotFoundException('Post not found');
    }
  }


  /**
   * Get posts by user name
   * @param userName - User name to search for
   * @returns Array of PostEntity objects
   */
  @Get('user/:userName')
  async findPostsByUserName(@Param('userName') userName: string): Promise<PostEntity[]> {
    const posts = await this.postService.findPostsByUserName(userName);
    if (!posts || posts.length === 0) {
      throw new NotFoundException('No posts found for this user name');
    }
    return posts;
  }
}
