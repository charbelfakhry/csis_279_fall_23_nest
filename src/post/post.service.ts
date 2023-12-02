import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @Inject('POST_REPOSITORY')
    private postRepository: Repository<Post>,
  ) {}


  /**
   * This function is an example of how to use the repository in a service.
   */
  async findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }
}