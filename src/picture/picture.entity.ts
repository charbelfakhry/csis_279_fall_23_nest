import { Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';

@Entity('pictures')
export class Picture {
  @PrimaryColumn()
  picture_url: string;

  @OneToOne(() => User, (user) => user.profilePicture)
  user!: User;

  @OneToOne(() => Post, (post) => post.postPicture)
  post!: Post;

  constructor(picture_url: string) {
    this.picture_url = picture_url;
  }
}
