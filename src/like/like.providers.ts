import { DataSource } from 'typeorm';
import { Like } from './like.entity';

export const likeProviders = [
  {
    provide: 'LIKE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Like),
    inject: ['DATA_SOURCE'],
  },
];
