import { IsNotEmpty } from 'class-validator';

/**
 * @author Ayman Al Sayegh
 * 
 * Data transfer object for creating a friendship.
 */
export class CreateFriendshipDto {
  @IsNotEmpty()
  status: 'pending' | 'accepted';
  
  @IsNotEmpty()
  user1: string;

  @IsNotEmpty()
  user2: string;

  constructor(user1: string, user2: string, status: 'pending' | 'accepted') {
    this.user1 = user1;
    this.user2 = user2;
    this.status = status;
  }
}
