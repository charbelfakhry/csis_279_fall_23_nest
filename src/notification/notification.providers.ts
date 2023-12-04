import { DataSource } from 'typeorm';
import { Notification } from './notification.entity';

export const notificationProviders = [
  {
    provide: 'NOTIFICATION_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Notification),
    inject: ['DATA_SOURCE'],
  },
];
