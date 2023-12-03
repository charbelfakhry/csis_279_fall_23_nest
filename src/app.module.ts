// app.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { PictureModule } from './picture/picture.module';
import { NotificationModule } from './notification/notification.module';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { FriendshipModule } from './friendship/friendship.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    PostModule,
    PictureModule,
    NotificationModule,
    LikeModule,
    CommentModule,
    FriendshipModule,
  ],
})
export class AppModule {}
