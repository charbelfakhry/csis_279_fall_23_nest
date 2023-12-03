import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { notificationProviders } from './notification.providers';
import { DatabaseModule } from '../database.module';
import { userProviders } from '../user/user.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationController],
  providers: [NotificationService, ...notificationProviders, ...userProviders],
})
export class NotificationModule {}
