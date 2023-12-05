import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/user.entity';

export class CreatePostLikeDto {
  user: User;

  @IsNotEmpty()
  postId: string;

  constructor(user: User, postId: string) {
    this.user = user;
    this.postId = postId;
  }
}

export class CreateCommentLikeDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  commentId: string;

  constructor(userId: string, commentId: string) {
    this.userId = userId;
    this.commentId = commentId;
  }
}