import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDTO } from './post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @Inject('POST_REPOSITORY')
    private postRepository: Repository<Post>,
  ) {}

  /**
   * Find post with post_id.
   * @param post_id
   * @returns Promise<User | null>
   */
  async findOneById(post_id: string): Promise<Post | null> {
    return this.postRepository.findOne({
      where: { post_id },
    });
  }
  /**
   * Find all posts
   * @returns Array of Post entities
   */
  async findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  /**
   * Find posts by user ID
   * @param user_id - User ID to search for
   * @returns Array of Post entities
   */
  async findByUserId(user_id: string): Promise<Post[]> {
    return this.postRepository.find({
      where: { user: { user_id } },
    });
  }

  /**
   * Create a new post
   * @param postData - Partial Post entity data
   * @returns Newly created Post entity
   */
  async createPost(
    postData: Partial<CreatePostDTO>,
    user: User,
  ): Promise<Post> {
    const newPost = this.postRepository.create({ ...postData, user });
    return this.postRepository.save(newPost);
  }

  /**
   * Update a post by ID
   * @param post_id - ID of the post to update
   * @param updateData - Partial Post entity data for update
   * @returns Updated Post entity
   */
  async updatePost(post_id: string, updateData: Partial<Post>): Promise<Post> {
    const postToUpdate = await this.postRepository.findOne({
      where: { post_id },
    });
    if (!postToUpdate) {
      throw new Error('Post not found');
    }

    // Update the entity's properties
    if (updateData) {
      Object.assign(postToUpdate, updateData);
    }

    return this.postRepository.save(postToUpdate);
  }

  /**
   * Delete a post by ID associated with a specific user
   * @param post_id - ID of the post to delete
   * @param user - User associated with the post
   */
  async deletePost(post_id: string, user: User): Promise<void> {
    const postToDelete = await this.postRepository.findOne({
      where: { post_id: post_id, user: { user_id: user.user_id } },
    });
    if (!postToDelete) {
      throw new Error('Post not found');
    }
    await this.postRepository.remove(postToDelete);
  }

  /**
   * Find posts by user name
   * @param userName - User name to search for
   * @returns Array of Post entities
   */
  async findPostsByUserName(userName: string): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder('post')
      .innerJoin('post.user', 'user')
      .where('user.user_name = :userName', { userName })
      .getMany();
  }
}
