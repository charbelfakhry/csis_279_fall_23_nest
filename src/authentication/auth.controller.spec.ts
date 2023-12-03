import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import { SignInCredentials, SignUpUserInfo } from '../types/auth.types';
import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('addUser', () => {
    it('should return 200 if all is valid', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await expect(
        authController.addUser(
          {
            username: 'firstTest',
            email: 'first@test.com',
            password: 'test',
            full_name: 'Fist Test',
            bio: 'This is the first test',
            profile_picture_url: 'https://www.google.com',
            // created_at: new Date() // Handled by user.entity
          },
          mockResponse as Response,
        ),
      );

      /* valid auth, hence we check the response values */
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Successful',
        access_token: expect.stringMatching(/Bearer \w+/),
      });
    });

    it('should return 400 if user data is missing', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await expect(
        authController.addUser(
          null as unknown as SignUpUserInfo,
          mockResponse as Response,
        ),
      ).rejects.toThrowError(new BadRequestException('Missing Data'));
    });

    it('should return 401 if username already exists', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await expect(
        authController.addUser(
          {
            username: 'firstTest',
            email: 'first@test.com',
            password: 'test',
            full_name: 'Fist Test',
            bio: 'This is the first test',
            profile_picture_url: 'https://www.google.com',
            // created_at: new Date() // Handled by user.entity
          },
          mockResponse as Response,
        ),
      ).rejects.toThrowError(new UnauthorizedException('Username exists'));
    });

    it('should return 401 if email already exists', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await expect(
        authController.addUser(
          {
            username: 'unique:)',
            email: 'first@test.com',
            password: 'test',
            full_name: 'Fist Test',
            bio: 'This is the first test',
            profile_picture_url: 'https://www.google.com',
            // created_at: new Date() // Handled by user.entity
          },
          mockResponse as Response,
        ),
      ).rejects.toThrowError(new UnauthorizedException('Email exists'));
    });
  });

  describe('authenticateUser', () => {
    it('should return 200 if user is correctly authenticated', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      /* wait for the authentication */
      await expect(
        authController.authenticateUser(
          {
            email: 'first@test.com',
            password: 'test',
          },
          mockResponse as Response,
        ),
      );

      /* valid auth, hence we check the response values */
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Successful',
        access_token: expect.stringMatching(/Bearer \w+/),
      });
    });

    it('should return 400 if user data is missing', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await expect(
        authController.authenticateUser(
          null as unknown as SignInCredentials, // to suppress ts
          mockResponse as Response,
        ),
      ).rejects.toThrowError(new BadRequestException('Missing Data'));
    });

    it('should return 404 if user not exist', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await expect(
        authController.authenticateUser(
          // does not exist
          { email: ' ', password: ' ' },
          mockResponse as Response,
        ),
      ).rejects.toThrowError(new NotFoundException('User does not exist'));
    });

    it('should return 401 if wrong credentials', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await expect(
        authController.authenticateUser(
          // invalid password, but user exists
          { email: 'first@test.com', password: 'wrong_pass' },
          mockResponse as Response,
        ),
      ).rejects.toThrowError(
        new UnauthorizedException('Cannot login with these credentials'),
      );
    });
  });
});
