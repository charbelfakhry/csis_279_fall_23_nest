import {
  BadRequestException,
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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostEntity } from './post.entity';
import { RequestWithUser } from 'src/middleware/token.middleware';
import { CreatePostRequestDTO, CreatePostResponseDTO } from './post.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { resolve } from 'path';
import e from 'express';
import { generateUniqueFileName } from '../utils/utils.files';
import { PictureService } from '../picture/picture.service';
import { LikeService } from '../like/like.service';

@Controller('posts')
export class PostController {
  private readonly logger = new Logger(PostController.name);
  constructor(
    private readonly postService: PostService,
    private readonly pictureService: PictureService,
    private readonly likeService: LikeService,
  ) {}

  /**
   * Get all posts
   * @returns Array of PostEntity objects
   */
  @Get()
  async findAll(): Promise<PostEntity[]> {
    return this.postService.findAll();
  }

  //Likes:

  @Get(':postId/likes')
  async getLikesForPost(@Param('postId') postId: string) {
    const likes = await this.likeService.findLikesForPost(postId);
    return { likes };
  }

  @Post(':postId/likes')
  async likePost(@Param('postId') postId: string, @Req() req: RequestWithUser) {
    const user = req.userEntity;
    const like = await this.likeService.likePost(user, postId);
    return { like };
  }

  @Delete(':postId/likes')
  async unlikePost(@Param('postId') postId: string, @Req() req: RequestWithUser) {
    const user = req.userEntity;
    const unlike = await this.likeService.unlikePost(user, postId);
    return { unlike };
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
   * @param file
   * @param postData - Partial data of PostEntity
   * @param request
   * @returns Created PostEntity object
   */

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'pic', maxCount: 1 }], {
      storage: diskStorage({
        destination: resolve('static', 'images'),
        /**
         * Provides a unique name for each file.
         * @param _
         * @param file
         * @param cb
         */
        filename(
          _: e.Request,
          file: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void,
        ) {
          cb(null, generateUniqueFileName(file.originalname));
        },
      }),
    }),
  )
  async createPost(
    @Body() postData: Partial<CreatePostRequestDTO>,
    @UploadedFiles() file: { pic?: Express.Multer.File[] },
    @Req() request: RequestWithUser,
  ): Promise<CreatePostResponseDTO> {
    const user = request.userEntity;
    const { pic } = file;

    if (!pic || pic.length === 0) throw new BadRequestException('Bad request');

    const img = pic[0];

    const postImage = await this.pictureService.insertPicture(img.filename);
    const post = await this.postService.createPost(postData, user, postImage);

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
    @Body() updateData: Partial<Omit<CreatePostRequestDTO, 'picture'>>,
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
