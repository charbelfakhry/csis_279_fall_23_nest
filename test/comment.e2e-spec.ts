import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CommentModule } from '../src/comment/comment.module';

describe('CommentController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CommentModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/comments/comment/:postId (GET)', async () => {
    const postId = '5ed54130-92c3-11ee-ab04-5811223a58c5';

    const response = await request(app.getHttpServer())
      .get(`/comments/comment/${postId}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          comment_id: expect.any(String),
          content: expect.any(String),
          created_at: expect.any(String),
        }),
      ]),
    );
  });

  it('/comments (POST)', async () => {
    const createCommentDto = {
      userId: 'f436917e-da70-47a9-815c-2d2e94d84dc8',
      postId: '5ed54130-92c3-11ee-ab04-5811223a58c5',
      content: 'Test Comment',
    };

    const response = await request(app.getHttpServer())
      .post('/comments')
      .send(createCommentDto)
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        comment_id: expect.any(String),
        content: 'Test Comment',
        created_at: expect.any(String),
      }),
    );
  });

  it('/comments (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/comments')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        comments: expect.arrayContaining([
          expect.objectContaining({
            comment_id: expect.any(String),
            content: expect.any(String),
            created_at: expect.any(String),
          }),
        ]),
      }),
    );
  });
});
