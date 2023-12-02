import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { NotificationEntity } from '../notifications/notification.entity';
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

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications!: NotificationEntity[];
}
