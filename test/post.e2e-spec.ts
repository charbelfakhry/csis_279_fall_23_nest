import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module'; 

describe('PostController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/posts (GET) - should return an array of posts', () => {
    return request(app.getHttpServer())
      .get('/posts')
      .expect(200)
      .expect([]);
  });

  it('/posts/:user_id (GET) - should return an array of posts for a given user ID', () => {
    const userId = 'user_id';
    return request(app.getHttpServer())
      .get(`/posts/${userId}`)
      .expect(200)
      .expect([]);
  });

  it('/posts (POST) - should create a new post', () => {
    const postData = { content: 'Test Content' };
    return request(app.getHttpServer())
      .post('/posts')
      .send(postData)
      .expect(201)
      .expect(({ body }) => {
        expect(body.content).toEqual(postData.content);
        expect(body.post_id).toBeDefined();
      });
  });


});
