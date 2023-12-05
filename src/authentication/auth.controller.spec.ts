import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthUserDto, RegisterUserDto } from './auth.dto';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('authenticateUser', () => {
    it('should authenticate user and return token', async () => {
      const signInCredentials = new AuthUserDto(
        'test@example.com',
        'password123',
      );

      jest
        .spyOn(authService, 'signIn')
        .mockResolvedValueOnce({ access_token: 'mockToken' });

      const mockResponse = await controller.authenticateUser(signInCredentials);

      expect(mockResponse.message).toEqual('Success');
    });

    it('should handle no user errors', async () => {
      const signInCredentials = new AuthUserDto(
        'test@example.com',
        'password123',
      );

      jest
        .spyOn(authService, 'signIn')
        .mockRejectedValueOnce(new NotFoundException('User does not exist'));

      try {
        await controller.authenticateUser(signInCredentials);
      } catch (error: any) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('User does not exist');
      }
    });

    it('should handle wrong password errors', async () => {
      const signInCredentials = new AuthUserDto(
        'test@test.com',
        'incorrectPassword',
      );

      jest
        .spyOn(authService, 'signIn')
        .mockRejectedValueOnce(
          new UnauthorizedException('Cannot login with these credentials'),
        );

      try {
        await controller.authenticateUser(signInCredentials);
      } catch (error: any) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Cannot login with these credentials');
      }
    });
  });

  describe('addUser', () => {
    it('should register user and return token', async () => {
      const signUpUserInfo = new RegisterUserDto(
        'testuser',
        'test@example.com',
        'password123',
      );

      jest
        .spyOn(authService, 'register')
        .mockResolvedValueOnce({ access_token: 'mockToken' });

      const mockResponse = await controller.addUser(signUpUserInfo);

      expect(mockResponse.message).toEqual('Success');
    });

    it('should handle username exists errors', async () => {
      const signUpUserInfo = new RegisterUserDto(
        'test',
        'test@example.com',
        'password123',
      );

      jest
        .spyOn(authService, 'register')
        .mockRejectedValueOnce(new UnauthorizedException('Username exists'));

      try {
        await controller.addUser(signUpUserInfo);
      } catch (error: any) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Username exists');
      }
    });
  });

  it('should handle email exists errors', async () => {
    const signUpUserInfo = new RegisterUserDto(
      'abc123',
      'test@test.com',
      'password123',
    );

    jest
      .spyOn(authService, 'register')
      .mockRejectedValueOnce(new UnauthorizedException('Email exists'));

    try {
      await controller.addUser(signUpUserInfo);
    } catch (error: any) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Email exists');
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
