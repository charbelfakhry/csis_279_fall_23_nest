import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';
import { CommentDto, CreateCommentDto } from './comment.dto';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @Inject('COMMENT_REPOSITORY')
    private commentRepository: Repository<Comment>,
    private userService: UserService,
    private postService: PostService,
  ) {}

  /**
   * Find all the comments of a post.
   * @param username
   * @param postId
   * @returns Promise<Comment[]>
   */
  async findCommentByPost(
    username: string,
    postId: string,
  ): Promise<CommentDto[]> {
    return (await this.commentRepository.find({
      where: { post: { post_id: postId, user: { username } } },
      select: { content: true, created_at: true, user: { username: true } },
    })) as unknown as Promise<CommentDto[]>;
  }

  /**
   * Create a comment on user's post.
   * @param username
   * @param postId
   * @param createCommentDto
   * @returns Promise<Comment>
   */
  async createComment(
    username: string,
    postId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const { content } = createCommentDto;

    // find the user and the post objects by id
    const user = await this.userService.findOneByUsername(username);
    const post = await this.postService.findOneById(postId);

    if (!user || !post) {
      throw new NotFoundException('User or Post not found');
    }

    const comment = this.commentRepository.create({
      user,
      post,
      content,
    });

    return this.commentRepository.save(comment);
  }

  /**
   * This function is an example of how to use the repository in a service.
   */
  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find();
  }

  async updateComment(
    username: string,
    postId: string,
    commentId: string,
    comment: CreateCommentDto,
  ) {
    const { content } = comment;
    const dbComment = await this.commentRepository.findOneBy({
      user: { username },
      post: { post_id: postId },
      comment_id: commentId,
    });
    if (dbComment) dbComment.content = content;
    return dbComment;
  }
}
