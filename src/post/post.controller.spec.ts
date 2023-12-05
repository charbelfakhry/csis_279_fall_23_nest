  import { NotFoundException } from '@nestjs/common';
  import { Test, TestingModule } from '@nestjs/testing';
  import { Response } from 'express';
  import { RequestWithUser } from 'src/middleware/token.middleware';
  import { PostController } from './post.controller';
  import { PostService } from './post.service';
  import { Post } from './post.entity';
  import { CreatePostRequestDTO, CreatePostResponseDTO } from './post.dto';

  describe('PostController', () => {
    let controller: PostController;
    let postService: PostService;

    
    const mockUser: RequestWithUser = {
      userEntity: {
        user_id: '1',
        username: 'testuser',
        email: 'testuser@example.com',
        
      },
      
    };

    
  const mockPost: Post = {
    post_id: '123',
    user: mockUser as any,
    content: 'Mock post content',
    created_at: new Date(),
    postPicture: mockPicture,
    likes: [],
    comments: [],
  };
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [PostController],
        providers: [PostService],
      }).compile();

      controller = module.get<PostController>(PostController);
      postService = module.get<PostService>(PostService);
    });

    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    describe('findAll', () => {
      it('should return an array of posts', async () => {
        const posts: Post[] = [mockPost];
        jest.spyOn(postService, 'findAll').mockResolvedValueOnce(posts);

        const result = await controller.findAll();

        expect(result).toEqual(posts);
      });
    });

    describe('findByUserId', () => {
      it('should return an array of posts for a given user ID', async () => {
        const userId = mockUser.user_id;
        const posts: Post[] = [mockPost];
        jest.spyOn(postService, 'findByUserId').mockResolvedValueOnce(posts);

        const result = await controller.findByUserId(userId);

        expect(result).toEqual(posts);
      });
    });

    describe('createPost', () => {
      it('should create a new post and return response DTO', async () => {
        const postData: Partial<CreatePostRequestDTO> = { content: 'Test content' };
        const createdPost: Post = { ...mockPost, ...postData, post_id: '124' };
        jest.spyOn(postService, 'createPost').mockResolvedValueOnce(createdPost);

        const result = await controller.createPost(postData, mockUser);

        const expectedResponse: CreatePostResponseDTO = {
          content: createdPost.content,
          picture: createdPost.postPicture?.picture_url,
          post_id: createdPost.post_id,
        };

        expect(result).toEqual(expectedResponse);
      });
    });

    describe('updatePost', () => {
      it('should update a post and return the updated post', async () => {
        const postId = mockPost.post_id;
        const updateData: Partial<CreatePostRequestDTO> = { content: 'Updated content' };
        const updatedPost: Post = { ...mockPost, ...updateData };
        jest.spyOn(postService, 'updatePost').mockResolvedValueOnce(updatedPost);

        const result = await controller.updatePost(postId, updateData, mockUser);

        expect(result).toEqual(updatedPost);
      });

      it('should handle NotFoundException when post is not found', async () => {
        const postId = 'nonexistent_id';
        const updateData: Partial<CreatePostRequestDTO> = { content: 'Updated content' };
        jest.spyOn(postService, 'updatePost').mockResolvedValueOnce(null);

        try {
          await controller.updatePost(postId, updateData, mockUser);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toBe('Post not found');
        }
      });
    });

    

    afterEach(() => {
      jest.clearAllMocks();
    });
  });
