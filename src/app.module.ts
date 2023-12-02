// app.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { PictureModule } from './picture/picture.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    DatabaseModule,
    ScheduleModule.forRoot(),
    UserModule,
    PostModule,
    PictureModule,
  ],
})
export class AppModule {}
