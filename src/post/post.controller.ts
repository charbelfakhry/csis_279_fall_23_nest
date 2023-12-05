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
import { CreatePostLikeDto } from '../like/like.dto';

@Controller('posts')
export class PostController {
  private readonly logger = new Logger(PostController.name);
  constructor(
    private readonly postService: PostService,
    private readonly pictureService: PictureService,
    private readonly likeService: LikeService,
  ) {}

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
   * Get posts by username
   * @param userName - Username to search for
   * @returns Array of PostEntity objects
   */
  @Get(':userName')
  async findPostsByUserName(
    @Param('userName') userName: string,
  ): Promise<PostEntity[]> {
    const posts = await this.postService.findPostsByUserName(userName);
    if (!posts || posts.length === 0) {
      throw new NotFoundException('No posts found for this user name');
    }
    return posts;
  }

  //Likes

  /**
   * Get all likes for a specific post.
   * @param {string} postId - The ID of the post.
   * @returns {Promise<{likes: Like[]}>} - A promise that resolves to an object containing an array of likes.
   */
  @Get(':postId/likes')
  async getLikesForPost(@Param('postId') postId: string) {
    const likes = await this.likeService.findLikesForPost(postId);
    return { likes };
  }

  /**
   * Like a post.
   * @param {string} postId - The ID of the post to like.
   * @param {RequestWithUser} req - The request object, which should contain a userEntity representing the authenticated user.
   * @returns {Promise<{like: Like}>} - A promise that resolves to an object containing the new like.
   */
  @Post(':postId/likes')
  async likePost(@Param('postId') postId: string, @Req() req: RequestWithUser) {
    const user = req.userEntity;
    const createPostLikeDto = new CreatePostLikeDto(user.user_id, postId);
    const like = await this.likeService.likePost(createPostLikeDto);
    return { like_id: like?.like_id, created_at: like?.created_at };
  }

  /**
   * Unlike a post.
   * @param {string} postId - The ID of the post to unlike.
   * @param {RequestWithUser} req - The request object, which should contain a userEntity representing the authenticated user.
   * @returns {Promise<{unlike: Like}>} - A promise that resolves to an object containing the removed like.
   */
  @Delete(':postId/likes')
  async unlikePost(
    @Param('postId') postId: string,
    @Req() req: RequestWithUser,
  ) {
    const user = req.userEntity;
    const createPostLikeDto = new CreatePostLikeDto(user.user_id, postId);
    await this.likeService.unlikePost(createPostLikeDto);
  }
}
