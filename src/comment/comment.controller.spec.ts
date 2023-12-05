import { Test, TestingModule } from '@nestjs/testing';
import { Picture } from '../picture/picture.entity';
import { Post } from '../post/post.entity';
import { User } from '../user/user.entity';
import { CommentController } from './comment.controller';
import { CreateCommentDto } from './comment.dto';
import { Comment } from './comment.entity';
import { CommentModule } from './comment.module';
import { CommentService } from './comment.service';

const mockUser = new User(
  'mock',
  'mock@mock.com',
  '$2b$15$/Jc1KMtftj3TONo2CvHmhujo98ojMQzvD6CMORmPT7dAmQC6FR5Aa',
  '',
  '',
  'defaultProfile.png',
);

const mockPost = new Post(
  mockUser,
  'TEST POST',
  new Picture('defaultProfile.png'),
);

describe('CommentController', () => {
  let controller: CommentController;
  let commentService: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommentModule],
    }).compile();

    controller = module.get<CommentController>(CommentController);
    commentService = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCommentByPost', () => {
    it('should return an array of comments', async () => {
      const postId = '5ed54130-92c3-11ee-ab04-5811223a58c5';
      const comments: Comment[] = [
        {
          comment_id: 'e361b686-92c3-11ee-ab04-5811223a58c5',
          content: 'TEST COMMENT',
          created_at: new Date('2023-12-04T22:19:53'),
          user: mockUser,
          post: mockPost,
        },
      ];

      jest
        .spyOn(commentService, 'findCommentByPost')
        .mockResolvedValue(comments);

      expect(await controller.getCommentByPost(postId)).toEqual(comments);
    });
  });

  describe('addComment', () => {
    it('should return the created comment', async () => {
      const createCommentDto: CreateCommentDto = {
        userId: 'f436917e-da70-47a9-815c-2d2e94d84dc8',
        postId: '5ed54130-92c3-11ee-ab04-5811223a58c5',
        content: 'Test Comment',
      };

      const createdCommentContent = 'Test Comment';

      expect((await controller.addComment(createCommentDto)).content).toEqual(
        createdCommentContent,
      );
    });
  });

  describe('getAll', () => {
    it('should return an object with comments property', async () => {
      const comments: Comment[] = [
        {
          comment_id: 'e361b686-92c3-11ee-ab04-5811223a58c5',
          user: mockUser,
          post: mockPost,
          content: 'TEST COMMENT',
          created_at: new Date('2023-12-04T22:19:53'),
        },
        // {
        //   comemnt_id: '2',
        //   user: mockUser,
        //   post: mockPost,
        //   content: 'This is a test comment 2',
        //   created_at: new Date(),
        // },
      ];

      jest.spyOn(commentService, 'findAll').mockResolvedValue(comments);

      expect(await controller.getAll()).toEqual({ comments });
    });
  });
});
