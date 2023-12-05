import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn('uuid')
  like_id!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Post, { nullable: false })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  constructor(user: User, post: Post) {
    this.user = user;
    this.post = post;
  }
}
