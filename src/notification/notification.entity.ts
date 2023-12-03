import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../user/user.entity';
  
  @Entity('notifications')
  export class Notification {
    @PrimaryGeneratedColumn('uuid')
    notification_id!: string;
  
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column({ type: 'text', nullable: false })
    content: string;
  
    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date;
  
    constructor(user: User, content: string) {
      this.user = user;
      this.content = content;
    }
  }
  