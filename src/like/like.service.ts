import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Like } from './like.entity';

@Injectable()
export class LikeService {
  constructor(
    @Inject('LIKE_REPOSITORY')
    private likeRepository: Repository<Like>,
  ) {}

  /**
   * This function is an example of how to use the repository in a service.
   */
  async findAll(): Promise<Like[]> {
    return this.likeRepository.find();
  }
}
