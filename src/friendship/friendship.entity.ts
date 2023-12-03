import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../user/user.entity';
  
  @Entity('friendships')
  export class Friendship {
    @PrimaryGeneratedColumn('uuid')
    friendship_id!: string;
  
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user1: User;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user2: User;
  
    @Column({ type: 'text', nullable: false })
    status: string;
  
    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date;
  
    constructor(user1: User, user2: User, status: string) {
      this.user1 = user1;
      this.user2 = user2;
      this.status = status;
    }
  }  