import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { likeProviders } from './like.providers';
import { DatabaseModule } from '../database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LikeController],
  providers: [LikeService, ...likeProviders],
})
export class LikeModule {}