import { Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { Post } from '../post/post.entity';
import { User } from '../user/user.entity';

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
