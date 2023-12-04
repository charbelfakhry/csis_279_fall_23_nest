import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { LikeController } from './like.controller';
import { likeProviders } from './like.providers';
import { LikeService } from './like.service';

@Module({
  imports: [DatabaseModule],
  controllers: [LikeController],
  providers: [LikeService, ...likeProviders],
})
export class LikeModule {}
