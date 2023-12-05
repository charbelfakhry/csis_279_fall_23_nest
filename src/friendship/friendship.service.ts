/**
 * @author Wassim Al Haraki, Ayman Al Sayegh, Wael Mattar
 */

import { Injectable, Inject, NotFoundException, PreconditionFailedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Friendship } from './friendship.entity';
import { CreateFriendshipDto } from './friendship.dto';

/**
 * Service responsible for managing friendships between users.
 */
@Injectable()
export class FriendshipService {
  constructor(
    @Inject('FRIENDSHIP_REPOSITORY')
    private friendshipRepository: Repository<Friendship>,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  /**
   * @author Wassim Al Haraki
   * 
   * Retrieves a list of ALL recommended friends for a given user, no need to use all, can use N most frequent users.
   * @param username The username of the user.
   * @returns A Promise that resolves to an array of recommended users, or null if no recommendations are available.
   * @throws NotFoundException if the user is not found.
   */
  async getRecommendedFriends(
    username: string
  ): Promise<User[]> {
    const user = await this.fetchUserByUsername(username);
    
    if (!user)
      throw new NotFoundException('User not found');

    const friendships = await this.findFriendshipsByUserId(username);

    if (!friendships)
      return new Array<User>;

    //[1; inf[ = frequency of indirect friend
    //0 = direct friend (to prevent cycles with user)
    var map = new Map<User, number>();

    //bfs
    for await (const f of friendships) {
      map.set(f.following, 0); //direct friend

      //find friendships
      const indirectFriendships = await this.findFriendshipsByUserId(f.following.username);
      
      //if no friendships
      if (!indirectFriendships)
        continue;
        
      //iterate + increment if indirect friend
      for await (const uf of indirectFriendships)
        if (!(map.has(uf.following))) //if doesn't exist in map
          map.set(uf.following, 1);
        else { //if exists, increment val if its not 0
          var val = map.get(uf.following);
          if (val) //if not 0, i.e. if user is an indirect friend
            map.set(uf.following, val + 1);
        }
    }

    //sort in non-increasing order of frequencies
    map = new Map([...map].sort((a, b) => {
      return b[1] - a[1];
    }));
    
    //fill array
    var recommendedUsers: Array<User> = [];
    for (let [key, value] of map)
      if (value > 0) //if indirect
        recommendedUsers.push(key);
      else
        break; //since sorted in an non-increasing order
    
    return recommendedUsers;
  }
  
  /**
   * @author Wassim Al Haraki
   * 
   * Creates a friendship between two users.
   * @param createFriendshipDto The data for creating the friendship.
   * @returns A Promise that resolves to the created Friendship object.
   * @throws NotFoundException if either user is not found.
   */
  async createFriendship(
    createFriendshipDto: CreateFriendshipDto,
  ): Promise<Friendship> {
    const userA = await this.fetchUserByUsername(createFriendshipDto.user1);
    const userB = await this.fetchUserByUsername(createFriendshipDto.user2);

    if (!userA && !userB)
      throw new NotFoundException('Both users not found');
    
    if (!userA)
      throw new NotFoundException('User1 not found');

    if (!userB)
      throw new NotFoundException('User2 not found');

    const friendship = this.friendshipRepository.create({
      follower: userA,
      following: userB,
      status: createFriendshipDto.status
    });

    return await this.friendshipRepository.save(friendship);
  }

  /**
   * @author Wassim Al Haraki
   * 
   * Updates the status of a friendship.
   * @param friendshipId The ID of the friendship.
   * @param status The new status of the friendship.
   * @returns A Promise that resolves to the updated Friendship object.
   * @throws NotFoundException if the friendship is not found.
   * @throws PreconditionFailedException if the status is invalid.
   */
  async updateFriendshipById(
    friendshipId: string,
    status: string,
  ): Promise<Friendship> {
    const friendship = await this.findFriendshipById(friendshipId);

    if (!friendship)
      throw new NotFoundException('Friendship not found');

    if (status != 'pending' && status != 'accepted')
      throw new PreconditionFailedException('Invalid status');

    friendship.status = status || '';

    return await this.friendshipRepository.save(friendship);
  }

  /**
   * @author Wassim Al Haraki
   * 
   * Updates a friendship between two users.
   * @param user1 The username of the first user.
   * @param user2 The username of the second user.
   * @param updateFriendshipDto The data to update the friendship.
   * @returns The updated friendship.
   * @throws NotFoundException if the friendship is not found.
   */
  async updateFriendshipByUsers(
    user1: string,
    user2: string,
    updateFriendshipDto: CreateFriendshipDto,
  ): Promise<Friendship> {
    const friendship = await this.findFriendshipByUsers(user1, user2);

    if (!friendship)
      throw new NotFoundException('Friendship not found');

    friendship.status = updateFriendshipDto.status || 'pending';

    return await this.friendshipRepository.save(friendship);
  }

  /**
   * @author Wael Mattar
   * 
   * Deletes a friendship by its ID.
   * @param friendshipId The ID of the friendship to delete.
   * @throws NotFoundException if the friendship is not found.
   */
  async deleteFriendshipById(friendshipId: string): Promise<void> {
    const friendship = await this.findFriendshipById(friendshipId);

    if (!friendship)
      throw new NotFoundException('Friendship not found');

    await this.friendshipRepository.remove(friendship);
  }

  /**
   * @author Wael Mattar
   * 
   * Deletes a friendship between two users.
   * @param user1 The username of the first user.
   * @param user2 The username of the second user.
   * @throws NotFoundException if the friendship does not exist.
   */
  async deleteFriendshipByUsers(
    user1: string,
    user2: string
    ): Promise<void> {
    const friendship = await this.findFriendshipByUsers(user1, user2);

    if (!friendship)
      throw new NotFoundException('Friendship not found');

    await this.friendshipRepository.remove(friendship);
  }

  /**
   * @author Ayman Al Sayegh
   * 
   * Finds a friendship by its ID.
   * @param friendshipId The ID of the friendship to find.
   * @returns A Promise that resolves to the found Friendship object, or null if not found.
   */
  async findFriendshipById(friendshipId: string): Promise<Friendship | null> {
    return await this.friendshipRepository.findOne({
      where: { friendship_id: friendshipId },
    });
  }

  /**
   * @author Ayman Al Sayegh
   * 
   * Finds a friendship between two users.
   * @param user1 The username of the first user.
   * @param user2 The username of the second user.
   * @returns A Promise that resolves to the Friendship object if found, or null if not found.
   */
  async findFriendshipByUsers(
    user1: string,
    user2: string
    ): Promise<Friendship | null> {
    return await this.friendshipRepository.findOne({
      where: [
        { follower: { username: user1 } },
        { following: { username: user2 } },
      ],
    });
  }

  /**
   * @author Wassim Al Haraki
   * 
   * Finds all friendships associated with a user.
   * @param username The username of the user.
   * @returns A Promise that resolves to an array of Friendship objects, or null if no friendships are found.
   */
  async findFriendshipsByUserId(username: string): Promise<Friendship[] | null> {
    return await this.friendshipRepository.find({
      where: { follower: { username: username } },
      relations: ['follower', 'following']
    });
  }

  /**
   * @author Wassim Al Haraki
   * 
   * Retrieves all friendships.
   * @returns A Promise that resolves to an array of all Friendship objects.
   */
  async findAll(): Promise<Friendship[]> {
    return await this.friendshipRepository.find({
      relations: ['follower', 'following']
    });
  }

  /**
   * @author Ayman Al Sayegh
   * 
   * Fetches a user by their ID.
   * @param username The username of the user to fetch.
   * @returns A Promise that resolves to the fetched User object, or null if not found.
   */
  private async fetchUserByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { username: username },
    });
  }
}