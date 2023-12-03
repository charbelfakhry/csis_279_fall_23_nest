import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './notifications.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationsService: NotificationService) {}

  @Post(':userId')
  async createNotification(
    @Param('userId') userId: number,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    const notification = await this.notificationsService.createNotification(
      userId,
      createNotificationDto,
    );
    return { notification };
  }

  @Get('/')
  async getAll() {
    const notifications = await this.notificationsService.findAll();
    return { notifications };
  }

  @Get(':id')
  async getNotification(@Param('id') id: number) {
    const notification =
      await this.notificationsService.getNotificationById(id);
    return { notification };
  }

  @Put(':id')
  async updateNotification(
    @Param('id') id: number,
    @Body() updateNotificationDto: CreateNotificationDto,
  ) {
    const updatedNotification =
      await this.notificationsService.updateNotification(
        id,
        updateNotificationDto,
      );
    return { updatedNotification };
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: number) {
    await this.notificationsService.deleteNotification(id);
    return { message: 'Notification deleted successfully' };
  }
}
