   import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { UserEntity } from '../notifications/user.entity';
  
  @Entity('notifications')
  export class NotificationEntity {
    @PrimaryGeneratedColumn()
    notification_id!: number;
  
    @Column({ type: 'text', nullable: false })
    content!: string;

    @ManyToOne(() => UserEntity, (user) => user.notifications)
    @JoinColumn({ name: 'user_id' })
    user!: UserEntity;
  }
  