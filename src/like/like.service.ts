import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository, Equal } from 'typeorm';
import { Like } from './like.entity';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';

@Injectable()
export class LikeService {
  constructor(
    @Inject('LIKE_REPOSITORY')
    private likeRepository: Repository<Like>,
    @Inject('POST_REPOSITORY')
    private postRepository: Repository<Post>,
    @Inject('COMMENT_REPOSITORY')
    private commentRepository: Repository<Comment>,
  ) {}

  /**
   * This function is an example of how to use the repository in a service.
   */
  async findAll(): Promise<Like[]> {
    return this.likeRepository.find();
  }

  //Posts:

  async likePost(user: User, postId: string): Promise<Like | null> {
    const post = await this.postRepository.findOne({
      where: { post_id: postId },
    });
    if (!post) {
      throw new Error('Post not found');
    }
    const like = this.likeRepository.create({ user, post });
    await this.likeRepository.save(like);
    return like;
  }

  async unlikePost(user: User, postId: string): Promise<Like | null> {
    const like = await this.likeRepository.findOne({
      where: {
        user: { user_id: user.user_id },
        post: { post_id: postId },
      },
    });
    if (like) {
      await this.likeRepository.remove(like);
    }
    return like;
  }

  async findLikesForPost(postId: string): Promise<Like[]> {
    // const post = await this.postRepository.findOne({
    //   where: { post_id: postId },
    // });
    return this.likeRepository.find({ 
      where:{
        post: { post_id: postId },
      },
    });
  
  }

  //Comments:

  // async findLikesForComment(commentId: string): Promise<Like[]> {
  //   const comment = await this.commentRepository.findOne({
  //     where: { comment_id: commentId },
  //   });
  //   if (!comment) {
  //     throw new Error('Comment not found');
  //   }
  //   return this.likeRepository.find({ where: { comment } });
  // }

  // async likeComment(commentId: string): Promise<Like> {
  //   const comment = await this.commentRepository.findOne(commentId);

  //   const like = this.likeRepository.create({ comment });
  //   await this.likeRepository.save(like);
  //   return like;
  // }

  // async unlikeComment(commentId: string): Promise<Like | null> {
  //   const comment = await this.commentRepository.findOne(commentId);
  //   const like = await this.likeRepository.findOne({ where: { comment } });
  //   if (like) {
  //     await this.likeRepository.remove(like);
  //   }
  //   return like;
  // }
}
