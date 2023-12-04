import { IsNotEmpty } from "class-validator";

/**
 * DTO class for creating Comments
 */
export class CreateCommentDto {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    postId: string;

    content: string;

    constructor(userId: string, postId: string, content: string) {
        this.userId = userId;
        this.postId = postId;
        this.content = content;
    }
}