import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { Post } from '../post/post.entity';
import { CreatePostLikeDto } from './like.dto';

/**
 * Service for handling likes.
 */
@Injectable()
export class LikeService {
  /**
   * @param {Repository<Like>} likeRepository - The repository for the Like entity.
   * @param {Repository<Post>} postRepository - The repository for the Post entity.
   * @param {Repository<User>} userRepository - The repository for the User entity.
   */
  constructor(
    @Inject('LIKE_REPOSITORY')
    private likeRepository: Repository<Like>,
    @Inject('POST_REPOSITORY')
    private postRepository: Repository<Post>,
  ) {}

  /**
   * Find all likes for a specific post.
   * @param {string} postId - The ID of the post.
   * @returns {Promise<Like[]>} - A promise that resolves to an array of likes.
   */
  async findLikesForPost(postId: string): Promise<Like[]> {
    return this.likeRepository.find({
      where: {
        post: { post_id: postId },
      },
    });
  }

  /**
   * Find all likes for a specific comment.
   * @param {string} commentId - The ID of the comment.
   * @returns {Promise<Like[]>} - A promise that resolves to an array of likes.
   */
  async likePost(CreatePostLikeDto: CreatePostLikeDto): Promise<Like | null> {
    const post = await this.postRepository.findOne({
      where: { post_id: CreatePostLikeDto.postId },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const user = CreatePostLikeDto.user;

    const like = this.likeRepository.create({ user, post });
    await this.likeRepository.save(like);
    return like;
  }

  /**
   * Unlike a post.
   * @param {string} userId - The ID of the user.
   * @param {string} postId - The ID of the post.
   * @returns {Promise<Like | null>} - A promise that resolves to the removed like.
   */
  async unlikePost(CreatePostLikeDto: CreatePostLikeDto): Promise<Like | null> {
    const like = await this.likeRepository.findOne({
      where: {
        user: { user_id: CreatePostLikeDto.user.user_id },
        post: { post_id: CreatePostLikeDto.postId },
      },
    });
    if (like) {
      await this.likeRepository.remove(like);
    }
    return like;
  }
}
