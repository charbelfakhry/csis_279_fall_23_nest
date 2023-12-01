import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('authenticateUser', () => {
    it('should return 200 if user is correctly authenticated', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await authController.authenticateUser(
        {
          email: 'first@test.com',
          password: 'test',
        },
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Successful',
      });
    });

    it('should return 400 if user data is missing', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await authController.authenticateUser(null, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Missing Data',
      });
    });

    it('should return 500 if generating the token throws an error or internal error', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await authController.authenticateUser(
        { email: 'first@test.com', password: 'test' },
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal Server Error' || 'Error generating token',
      });
    });

    it('should return 401 if wrong credentials', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await authController.authenticateUser(
        { email: 'first@test.com', password: 'password' },
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Cannot login with these credentials',
      });
    });
  });

  describe('addUser', () => {
    it('should return 400 if user data is missing', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await authController.addUser(null, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Missing Data',
      });
    });

    it('should return 500 if bcrypt.hash throws an error or internal error', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await authController.addUser(
        {
          username: 'test',
          email: 'test@example.com',
          password: 'password',
          full_name: 'test',
          bio: 'test',
          profile_picture_url: 'test',
          created_at: 'test',
        },
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal Server Error' || 'Error generating token',
      });
    });

    it('should return 401 if user already exists', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await authController.addUser(
        {
          username: 'firstTest',
          email: 'first@test.com',
          password: 'test',
          full_name: 'Fist Test',
          bio: 'This is the first test',
          profile_picture_url: 'https://www.google.com',
          created_at: '2021-09-29 00:00:00',
        },
        mockResponse as Response,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Email already exists',
      });
    });
  });
});
