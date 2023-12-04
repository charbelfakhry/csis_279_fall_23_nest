import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../user/user.entity';
  import { Post } from '../post/post.entity';
  import { Comment } from '../comment/comment.entity';
  
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

    @ManyToOne(() => Comment, { nullable: true })
    @JoinColumn({ name: 'comment_id' })
    comment: Comment;
  
    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date;
  
    constructor(user: User, post: Post, comment: Comment) {
      this.user = user;
      this.post = post;
      this.comment = comment;
    }
  }
