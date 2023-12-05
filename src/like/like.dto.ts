import { IsNotEmpty } from 'class-validator';

export class CreatePostLikeDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  postId: string;

  constructor(userId: string, postId: string) {
    this.userId = userId;
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