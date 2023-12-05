import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Friendship } from './friendship.entity';

@Injectable()
export class FriendshipService {
  constructor(
    @Inject('FRIENDSHIP_REPOSITORY')
    private friendshipRepository: Repository<Friendship>,
  ) {}

  /**
   * This function is an example of how to use the repository in a service.
   */
  async findAll(): Promise<Friendship[]> {
    return this.friendshipRepository.find();
  }
}
