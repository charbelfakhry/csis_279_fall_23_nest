import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './notifications.dto';
// import { NotificationEntity } from './notification.entity';
import { User } from '../user/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createNotification(
    userId: number,
    createNotificationDto: CreateNotificationDto,
  ): Promise<NotificationEntity> {
    const user = await this.fetchUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      user: user,
    });

    return this.notificationRepository.save(notification);
  }

  async getNotificationById(
    notificationId: number,
  ): Promise<NotificationEntity> {
    const notification = await this.notificationRepository.findOne({
      where: { notification_id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async updateNotification(
    notificationId: number,
    updateNotificationDto: CreateNotificationDto,
  ): Promise<NotificationEntity> {
    const existingNotification = await this.notificationRepository.findOne({
      where: { notification_id: notificationId },
    });

    if (!existingNotification) {
      throw new NotFoundException('Notification not found');
    }

    // Update notification properties
    existingNotification.content = updateNotificationDto.content || '';

    return this.notificationRepository.save(existingNotification);
  }

  async deleteNotification(notificationId: number): Promise<void> {
    const existingNotification = await this.notificationRepository.findOne({
      where: { notification_id: notificationId },
    });

    if (!existingNotification) {
      throw new NotFoundException('Notification not found');
    }

    await this.notificationRepository.remove(existingNotification);
  }

  private async fetchUserById(userId: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      return null;
    }

    return user;
  }
}
