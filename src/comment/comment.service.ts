import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';
import { CreateCommentDto } from './comment.dto';
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
   * @param postId
   * @returns Promise<Comment[]>
   */
  async findCommentByPost(postId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { post: { post_id: postId } },
    });
  }

  /**
   * Create a comment on user's post.
   * @param createCommentDto
   * @returns Promise<Comment>
   */
  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { userId, postId, content } = createCommentDto;

    // find the user and the post objects by id
    const user = await this.userService.findOneById(userId);
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
}
