import { IsNotEmpty } from 'class-validator';

/**
 * DTO class for creating Comments
 */
export class CreateCommentDto {
  @IsNotEmpty()
  public content: string;

  constructor(content: string) {
    this.content = content;
  }
}

export class CommentDto {
  public content: string;
  public created_at: Date;
  public username: string;

  constructor(username: string, content: string, created_at: Date) {
    this.username = username;
    this.content = content;
    this.created_at = created_at;
  }
}
