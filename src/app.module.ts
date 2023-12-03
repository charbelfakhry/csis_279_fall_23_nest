// app.module.ts
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { PictureModule } from './picture/picture.module';
import { NotificationModule } from './notification/notification.module';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { FriendshipModule } from './friendship/friendship.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtMiddleware } from './middleware/token.middleware';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './authentication/auth.module';

@Module({
  imports: [
    // rate limiting
    ThrottlerModule.forRoot([
      {
        limit: 10,
        ttl: 60000,
      },
    ]),
    DatabaseModule,
    UserModule,
    PostModule,
    PictureModule,
    NotificationModule,
    LikeModule,
    CommentModule,
    FriendshipModule,
    AuthModule,
  ],
  providers: [JwtService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
