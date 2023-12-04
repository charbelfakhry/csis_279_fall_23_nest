import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @Inject('POST_REPOSITORY')
    private postRepository: Repository<Post>,
  ) { }


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
   * This function is an example of how to use the repository in a service.
   */
  async findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }
}
