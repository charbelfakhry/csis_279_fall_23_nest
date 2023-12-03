import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Like } from '../like/like.entity';
import { Picture } from '../picture/picture.entity';
import { Comment } from '../comment/comment.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  post_id!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text', nullable: false })
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @OneToOne(() => Picture)
  @JoinColumn({ name: 'post_picture_url' })
  postPicture!: Picture;

  // Reverse association
  // Risk of circular dependency
  @OneToMany(() => Like, (like) => like.post)
  likes!: Like[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];

  constructor(user: User, content: string) {
    this.user = user;
    this.content = content;
  }
}
