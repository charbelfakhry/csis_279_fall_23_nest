// src/entities/user.entity.ts
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  JoinColumn,
  OneToOne,
  Unique,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../post/post.entity';
import { Picture } from '../picture/picture.entity';
import { hash } from 'bcrypt';
import { Friendship } from '../friendship/friendship.entity';
import { Notification } from '../notification/notification.entity';

@Entity('users')
@Unique(['username', 'email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id!: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password_hash: string;

  @Column({ default: '' })
  full_name: string;

  @Column({ type: 'text', default: '' })
  bio: string;

  @Column({ nullable: true, default: 'defaultProfile.png' })
  profile_picture_url: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  // Reverse association
  // Risk of circular dependency
  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications!: Notification[];

  // Here, the user is user1 in Frienships, which means the current user is
  // following the all users2 in the Frienships array.
  // So the array represents the following of the user.
  @OneToMany(() => Friendship, (friendship) => friendship.follower)
  following!: Friendship[];

  // Here, friendships2 means the user is being followed by all the users1 in the
  // Frienships array. So the array represents the followers of the user.
  @OneToMany(() => Friendship, (friendship) => friendship.following)
  followers!: Friendship[];

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
