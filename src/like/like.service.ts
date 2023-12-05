import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';
import { CreatePostLikeDto, CreateCommentLikeDto } from './like.dto';

@Injectable()
export class LikeService {
  constructor(
    @Inject('LIKE_REPOSITORY')
    private likeRepository: Repository<Like>,
    @Inject('POST_REPOSITORY')
    private postRepository: Repository<Post>,
    @Inject('COMMENT_REPOSITORY')
    private commentRepository: Repository<Comment>,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  /**
   * This function is an example of how to use the repository in a service.
   */
  async findAll(): Promise<Like[]> {
    return this.likeRepository.find();
  }

  //Posts:

  async findLikesForPost(postId: string): Promise<Like[]> {
    return this.likeRepository.find({
      where: {
        post: { post_id: postId },
      },
    });
  }

  async likePost(CreatePostLikeDto: CreatePostLikeDto): Promise<Like | null> {
    const post = await this.postRepository.findOne({
      where: { post_id: CreatePostLikeDto.postId },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const user = await this.userRepository.findOne({
      where: { user_id: CreatePostLikeDto.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const like = this.likeRepository.create({ user, post });
    await this.likeRepository.save(like);
    return like;
  }

  async unlikePost(CreatePostLikeDto: CreatePostLikeDto): Promise<Like | null> {
    const like = await this.likeRepository.findOne({
      where: {
        user: { user_id: CreatePostLikeDto.userId },
        post: { post_id: CreatePostLikeDto.postId },
      },
    });
    if (like) {
      await this.likeRepository.remove(like);
    }
    return like;
  }

  //Comments:

  async findLikesForComment(commentId: string): Promise<Like[]> {
    return this.likeRepository.find({
      where: {
        comment: { comment_id: commentId },
      },
    });
  }

  async likeComment(
    createCommentLikeDto: CreateCommentLikeDto,
  ): Promise<Like | null> {
    const comment = await this.commentRepository.findOne({
      where: { comment_id: createCommentLikeDto.commentId },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    const user = await this.userRepository.findOne({
      where: { user_id: createCommentLikeDto.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const like = this.likeRepository.create({ user, comment });
    await this.likeRepository.save(like);
    return like;
  }

  async unlikeComment(
    createCommentLikeDto: CreateCommentLikeDto,
  ): Promise<Like | null> {
    const like = await this.likeRepository.findOne({
      where: {
        user: { user_id: createCommentLikeDto.userId },
        comment: { comment_id: createCommentLikeDto.commentId },
      },
    });
    if (like) {
      await this.likeRepository.remove(like);
    }
    return like;
  }
}
