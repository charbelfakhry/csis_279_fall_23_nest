import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { CreateNotificationDto } from './notifications.dto';
import { User } from '../user/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private notificationRepository: Repository<Notification>,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async getNotificationById(notificationId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { notification_id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async createNotification(
    userId: string,
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
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

  async updateNotification(
    notificationId: string,
    updateNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
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

  async deleteNotification(notificationId: string): Promise<void> {
    const existingNotification = await this.notificationRepository.findOne({
      where: { notification_id: notificationId },
    });

    if (!existingNotification) {
      throw new NotFoundException('Notification not found');
    }

    await this.notificationRepository.remove(existingNotification);
  }

  /**
   * This function is an example of how to use the repository in a service.
   */
  async findAll(): Promise<Notification[]> {
    return this.notificationRepository.find();
  }

  private async fetchUserById(userId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      return null;
    }

    return user;
  }
}
