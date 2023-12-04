import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { userProviders } from '../user/user.providers';
import { NotificationController } from './notification.controller';
import { notificationProviders } from './notification.providers';
import { NotificationService } from './notification.service';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationController],
  providers: [NotificationService, ...notificationProviders, ...userProviders],
})
export class NotificationModule {}
