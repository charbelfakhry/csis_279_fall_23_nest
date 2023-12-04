import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

/*
 * Here, the frienship model represents a user following another.
 * It is not mutual, which means the order matters; one user following another
 * doesn't necessitate that the latter is following the former.
 */
@Entity('friendships')
export class Friendship {
  @PrimaryGeneratedColumn('uuid')
  friendship_id!: string;

  // follower
  // user_id1 in the database
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id1' })
  follower: User;

  // followed
  // user_id2 in the database
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id2' })
  following: User;

  @Column({ type: 'text', nullable: false })
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  constructor(follower: User, following: User, status: string) {
    this.follower = follower;
    this.following = following;
    this.status = status;
  }
}
