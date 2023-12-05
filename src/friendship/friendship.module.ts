import { Module } from '@nestjs/common';
import { FriendshipController } from './friendship.controller';
import { FriendshipService } from './friendship.service';
import { friendshipProviders } from './friendship.providers';
import { DatabaseModule } from '../database.module';
import { userProviders } from '../user/user.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [FriendshipController],
  providers: [FriendshipService, ...friendshipProviders, ...userProviders],
  exports: [FriendshipService]
})
export class FriendshipModule {}