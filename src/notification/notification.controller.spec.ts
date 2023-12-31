import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../user/user.entity';
import { NotificationController } from './notification.controller';
import { NotificationModule } from './notification.module';
import { NotificationService } from './notification.service';

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NotificationModule],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createNotification', () => {
    it('should create a notification', async () => {
      const userId = 'f436917e-da70-47a9-815c-2d2e94d84dc8';
      const createNotificationDto = { content: 'Test notification' };

      const result = await controller.createNotification(
        userId,
        createNotificationDto,
      );
      expect(result).toEqual({
        notification: expect.objectContaining({ content: 'Test notification' }),
      });
    });
  });

  describe('getAll', () => {
    it('should get all notifications', async () => {
      const result = await controller.getAll();
      expect(result.notifications).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            content: expect.any(String),
            notification_id: expect.any(String),
            created_at: expect.any(String),
            user: undefined,
          }),
        ]),
      );
    });
  });

  describe('getNotification', () => {
    it('should get a notification by ID', async () => {
      const notificationId = '0a940c5f-1650-4548-bed8-36b1ca09a19b';

      jest.spyOn(service, 'getNotificationById').mockResolvedValueOnce({
        notification_id: '123',
        user: new User('test', 'test@test.com', 'test', 'test', 'test', 'test'),
        content: 'Test notification',
        created_at: new Date(),
      });

      const result = await controller.getNotification(notificationId);
      expect(result).toEqual({
        notification: expect.objectContaining({ content: 'Test notification' }),
      });
    });

    it('should throw NotFoundException if notification not found', async () => {
      const notificationId = 'nonexistent';

      jest
        .spyOn(service, 'getNotificationById')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(controller.getNotification(notificationId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateNotification', () => {
    it('should update a notification by ID', async () => {
      const notificationId = '123';
      const updateNotificationDto = { content: 'Updated content' };

      jest.spyOn(service, 'updateNotification').mockResolvedValueOnce({
        notification_id: '123',
        user: new User('test', 'test@test.com', 'test', 'test', 'test', 'test'),
        content: 'Updated content',
        created_at: new Date(),
      });

      const result = await controller.updateNotification(
        notificationId,
        updateNotificationDto,
      );
      expect(result).toEqual({
        updatedNotification: expect.objectContaining({
          content: 'Updated content',
        }),
      });
    });

    it('should throw NotFoundException if notification not found', async () => {
      const notificationId = 'nonexistent';
      const updateNotificationDto = { content: 'Updated content' };

      jest
        .spyOn(service, 'updateNotification')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(
        controller.updateNotification(notificationId, updateNotificationDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification by ID', async () => {
      const notificationId = '123';

      jest.spyOn(service, 'deleteNotification').mockResolvedValueOnce();

      const result = await controller.deleteNotification(notificationId);
      expect(result).toEqual({ message: 'Notification deleted successfully' });
    });

    it('should throw NotFoundException if notification not found', async () => {
      const notificationId = 'nonexistent';

      jest
        .spyOn(service, 'deleteNotification')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(
        controller.deleteNotification(notificationId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
