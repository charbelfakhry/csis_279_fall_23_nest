import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../user/user.entity';
  import { Post } from '../post/post.entity';
  
  @Entity('comments')
  export class Comment {
    @PrimaryGeneratedColumn('uuid')
    comemnt_id!: string;
  
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Post, { nullable: false })
    @JoinColumn({ name: 'post_id' })
    post: Post;
  
    @Column({ type: 'text', nullable: false })
    content: string;
  
    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date;
  
    constructor(user: User, post: Post, content: string) {
      this.user = user;
      this.post = post;
      this.content = content;
    }
  }  