// app.module.ts
import { Module } from '@nestjs/common';
import { NotificationsModule } from './notifications/notifications.module';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule, NotificationsModule],
})
export class AppModule {}
