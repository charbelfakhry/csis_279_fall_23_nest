// src/entities/user.entity.ts
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  Unique,
} from 'typeorm';
import { Post } from '../post/post.entity';
import { Picture } from '../picture/picture.entity';
import { hash } from 'bcrypt';

@Entity('users')
@Unique(['username', 'email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id!: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password_hash: string;

  @Column()
  full_name: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  profile_picture_url: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  // Reverse association
  // Risk of circular dependency
  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];
   
  @OneToOne(() => Picture)
  @JoinColumn({ name: 'profile_picture_url' })
  profilePicture!: Picture;

  @BeforeInsert()
  async hashPassword() {
    this.password_hash = await hash(this.password_hash, 15);
  }

  constructor(
    username: string,
    email: string,
    password_hash: string,
    full_name: string,
    bio: string,
    profile_picture_url: string,
  ) {
    this.username = username;
    this.email = email;
    this.password_hash = password_hash;
    this.full_name = full_name;
    this.bio = bio;
    this.profile_picture_url = profile_picture_url;
  }
}