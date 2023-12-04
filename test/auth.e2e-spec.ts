import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../src/authentication/auth.module';

describe('AuthController (e2e)', () => {
  let app: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST) - should authenticate user and return token', async () => {
    const signInCredentials = {
      email: 'test@test.com',
      password: 'testtest',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(signInCredentials)
      .expect(200);

    expect(response.body.message).toBe('Success');
    expect(response.body.access_token).toBeDefined();
  });

  it('/auth/login (POST) - should handle no user errors', async () => {
    const signInCredentials = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(signInCredentials)
      .expect(404);

    expect(response.body.message).toBe('User does not exist');
  });

  it('/auth/login (POST) - should handle wrong password errors', async () => {
    const signInCredentials = {
      email: 'test@test.com',
      password: 'wrongpassword',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(signInCredentials)
      .expect(401);

    expect(response.body.message).toBe('Cannot login with these credentials');
  });

  it('/auth/register (POST) - should register user and return token', async () => {
    const signUpUserInfo = {
      username: 'test4',
      email: 'test1@test4.com',
      password: 'password123',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(signUpUserInfo)
      .expect(200);

    expect(response.body.message).toBe('Success');
    expect(response.body.access_token).toBeDefined();
  });

  it('/auth/register (POST) - should handle username exists errors', async () => {
    const signUpUserInfo = {
      username: 'test',
      email: 'test@example.com',
      password: 'password123',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(signUpUserInfo)
      .expect(401);

    expect(response.body.message).toBe('Username exists');
  });

  it('/auth/register (POST) - should handle email exists errors', async () => {
    const signUpUserInfo = {
      username: 'newuser',
      email: 'test@test.com',
      password: 'password123',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(signUpUserInfo)
      .expect(401);

    expect(response.body.message).toBe('Email exists');
  });
});
