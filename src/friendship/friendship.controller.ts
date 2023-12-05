import { Controller, Get } from '@nestjs/common';
import { FriendshipService } from './friendship.service';

@Controller('friendships')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}


  @Get('/')
  async getAll() {
    const friendships = await this.friendshipService.findAll();
    return { friendships };
  }
}
