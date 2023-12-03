import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private notificationRepository: Repository<Notification>,
  ) {}


  /**
   * This function is an example of how to use the repository in a service.
   */
  async findAll(): Promise<Notification[]> {
    return this.notificationRepository.find();
  }
}