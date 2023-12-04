import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { FriendshipController } from './friendship.controller';
import { friendshipProviders } from './friendship.providers';
import { FriendshipService } from './friendship.service';

@Module({
  imports: [DatabaseModule],
  controllers: [FriendshipController],
  providers: [FriendshipService, ...friendshipProviders],
})
export class FriendshipModule {}
