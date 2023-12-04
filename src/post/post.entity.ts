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
  // Primary key for the Post entity
  @PrimaryGeneratedColumn('uuid')
  post_id!: string;

  // Many-to-one relation with User entity, enforcing non-nullability
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Column for the content of the post, non-nullable text
  @Column({ type: 'text', nullable: false })
  content: string;

  // Timestamp for creation date of the post
  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  // One-to-one relation with Picture entity
  @OneToOne(() => Picture)
  @JoinColumn({ name: 'post_picture_url' })
  postPicture!: Picture;

  // Reverse association with Like entity, representing post likes
  // Risk of circular dependency - likes associated with the post
  @OneToMany(() => Like, (like) => like.post)
  likes!: Like[];

  // Reverse association with Comment entity, representing post comments
  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];

  /**
   * Constructor for the Post entity.
   * @param user - User who created the post
   * @param content - Content of the post
   * @param postPicture - Picture associated with the post
   */
  constructor(user: User, content: string, postPicture: Picture) {
    this.user = user;
    this.content = content;
    this.postPicture = postPicture;
  }
}
