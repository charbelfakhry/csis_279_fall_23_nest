import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { NotificationEntity } from './notification.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  user_id!: number;

  username!: string;
  email!: string;
  password_hash!: string;
  full_name!: string;
  bio!: string;
  profile_picture!: number;

  @OneToMany(
    () => NotificationEntity,
    (notification: NotificationEntity) => notification.user,
  )
  notifications!: NotificationEntity[];
}
