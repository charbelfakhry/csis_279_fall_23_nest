
import { Test, TestingModule } from '@nestjs/testing';
import { FriendshipController } from './friendship.controller';
import { FriendshipService } from './friendship.service';
import { Friendship } from './friendship.entity';
import { getRepositoryToken } from '@nestjs/typeorm'; 

describe('FriendshipController', () => {
  let controller: FriendshipController;
  let friendshipService: FriendshipService;

  
  const mockUser1 = {
    user_id: '1',
    username: 'user1',
    email: 'user1@example.com',
    
  };

  const mockUser2 = {
    user_id: '2',
    username: 'user2',
    email: 'user2@example.com',
    
  };

  
  const mockFriendships: Friendship[] = [
    {
      friendship_id: '1',
      user1: mockUser1 as any,
      user2: mockUser2 as any,
      status: 'accepted',
      created_at: new Date(),
    },
    
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendshipController],
      providers: [
        FriendshipService,
        {
          provide: getRepositoryToken(Friendship), 
          useValue: {
            find: jest.fn(() => mockFriendships), 
          },
        },
      ],
    }).compile();

    controller = module.get<FriendshipController>(FriendshipController);
    friendshipService = module.get<FriendshipService>(FriendshipService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of friendships', async () => {
      const result = await controller.getAll();

      expect(result).toEqual({ friendships: mockFriendships });
    });
  });

  

  afterEach(() => {
    jest.clearAllMocks();
  });
});
