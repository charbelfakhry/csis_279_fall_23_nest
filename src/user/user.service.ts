import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}


  /**
   * This function is an example of how to use the repository in a service.
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}