/**
 * @author Wassim Al Haraki, Ayman Al Sayegh, Wael Mattar
 */

import {
  Body,
  Delete,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { CreateFriendshipDto } from './friendship.dto';

/**
 * Controller for managing friendships.
 */
@Controller('friendships')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) { }

  /**
   * @author Wassim Al Haraki
   * 
   * Get recommended friends for a user.
   * @param username The username of the user.
   * @returns An object containing the recommended friends.
   */
  @Get('/recommended/:username')
  async getRecommendedFriends(
    @Param('username') username: string
  ) {
    const recommendedFriends = await this.friendshipService.getRecommendedFriends(username);
    return { recommendedFriends };
  }

  /**
   * @author Wael Mattar
   * 
   * Create a new friendship.
   * @param info The friendship information.
   * @returns An object containing the created friendship.
   */
  @Post('/')
  async createFriendship(
    @Body() info: {
      user1: string,
      user2: string,
      status: 'pending' | 'accepted'
    },
  ) {
    const friendship = await this.friendshipService.createFriendship({
      user1: info.user1,
      user2: info.user2,
      status: info.status,
    });

    return { friendship };
  }  

  /**
   * @author Wael Mattar
   * 
   * Get all friendships.
   * @returns An object containing all friendships.
   */
  @Get('/')
  async getAll() {
    const friendships = await this.friendshipService.findAll();
    return { friendships };
  }

  /**
   * @author Ayman Al Sayegh
   * 
   * Find a friendship by ID.
   * @param id The ID of the friendship.
   * @returns An object containing the found friendship.
   */
  @Get('/by_id')
  async findFriendshipById(@Body() id: string) {
    const friendship = await this.friendshipService.findFriendshipById(id);
    return { friendship };
  }

  /**
   * @author Ayman Al Sayegh
   * 
   * Find a friendship between two users.
   * @param user1 The username of the first user.
   * @param user2 The uesrname of the second user.
   * @returns An object containing the found friendship.
   */
  @Get('/between_users')
  async findFriendshipByUsers(
    @Body("user1") user1: string,
    @Body("user2") user2: string
    ) {
    const friendship = await this.friendshipService.findFriendshipByUsers(user1, user2);
    return { friendship };
  }

  /**
   * @author Wassim Al Haraki
   * 
   * Find all friendships of a user.
   * @param user1 The ID of the user.
   * @returns An object containing all friendships of the user.
   */
  @Get('/user_friends')
  async findFriendshipsByUserId(@Body("user1") user1: string) {
    const friendships = await this.friendshipService.findFriendshipsByUserId(user1);
    return { friendships };
  }

  /**
   * @author Wael Mattar
   * 
   * Update a friendship by ID.
   * @param id The ID of the friendship.
   * @param status The new status of the friendship.
   * @returns An object containing the update notification.
   */
  @Put('/:id')
  async updateFriendshipById(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    const updateNotification = await this.friendshipService.updateFriendshipById(
        id,
        status
    );
    return { updateNotification };
  }

  /**
   * @author Wael Mattar
   * 
   * Update a friendship between two users.
   * @param user1 The username of the first user.
   * @param user2 The username of the second user.
   * @param status The new status of the friendship.
   * @returns An object containing the update notification.
   */
  @Put('/')
  async updateFriendshipByUsers(
    @Body('user1') user1: string,
    @Body('user2') user2: string,
    @Body() status: CreateFriendshipDto,
  ) {
    const updateNotification = await this.friendshipService.updateFriendshipByUsers(
        user1,
        user2,
        status
    );
    return { updateNotification };
  }

  /**
   * @author Wael Mattar
   * 
   * Delete a friendship by ID.
   * @param id The id of the friendship.
   * @returns An object containing a deletion message.
   */
  @Delete('/:id')
  async deleteNotificationById(@Param('id') id: string) {
    await this.friendshipService.deleteFriendshipById(id);
    return { message: 'Friendship deleted' };
  }

  /**
   * @author Wael Mattar
   * 
   * Delete a friendship between two users.
   * @param user1 The username of the first user.
   * @param user2 The username of the second user.
   * @returns An object containing a deletion message.
   */
  @Delete('/')
  async deleteNotificationByUsers(
    @Body('user1') user1: string,
    @Body('user2') user2: string,
    ) {
    await this.friendshipService.deleteFriendshipByUsers(
      user1,
      user2
    );
    return { message: 'Friendship deleted' };
  }
}