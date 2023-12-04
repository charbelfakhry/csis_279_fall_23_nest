import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

//before testing, make a new auth token since this one will eventually expire
const dummyAuthToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNDM2OTE3ZS1kYTcwLTQ3YTktODE1Yy0yZDJlOTRkODRkYzgiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE3MDE3MDk2MDcsImV4cCI6MTcwMzQxODUxNjYzNX0.pZPabXS2Bq_-KJXUsPHZM5wnhT_9Xgz0VhltkfC4ZT0';

let testNotiID = '';

describe('NotificationController (e2e)', () => {
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

  it('/notifications/:userId (POST) - should create a notification', async () => {
    const userId = 'f436917e-da70-47a9-815c-2d2e94d84dc8';
    const createNotificationDto = { content: 'Test notification' };

    const response = await request(app.getHttpServer())
      .post(`/notifications/${userId}`)
      .set('authorization', `Bearer ${dummyAuthToken}`)
      .send(createNotificationDto)
      .expect(201);

    expect(response.body).toEqual({
      notification: expect.objectContaining({
        content: 'Test notification',
      }),
    });

    testNotiID = response.body.notification.notification_id;
  });

  it('/notifications/ (GET) - should get all notifications', async () => {
    const response = await request(app.getHttpServer())
      .get('/notifications/')
      .set('authorization', `Bearer ${dummyAuthToken}`)
      .expect(200);

    // Ensure that the response contains an array of notifications
    expect(response.body.notifications).toBeInstanceOf(Array);
  });

  it('/notifications/:id (GET) - should get a notification by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/notifications/${testNotiID}`)
      .set('authorization', `Bearer ${dummyAuthToken}`)
      .expect(200);

    expect(response.body).toEqual({
      notification: expect.arrayContaining(
        expect.objectContaining({
          content: expect.any(String),
          notification_id: expect.any(String),
          created_at: expect.any(String),
        }),
      ),
    });
  });

  it('/notifications/:id (PUT) - should update a notification by ID', async () => {
    const updateNotificationDto = { content: 'Updated content' };

    const response = await request(app.getHttpServer())
      .put(`/notifications/${testNotiID}`)
      .set('authorization', `Bearer ${dummyAuthToken}`)
      .send(updateNotificationDto)
      .expect(200);

    expect(response.body).toEqual({
      updatedNotification: expect.objectContaining({
        content: 'Updated content',
      }),
    });
  });

  it('/notifications/:id (DELETE) - should delete a notification by ID', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/notifications/${testNotiID}`)
      .set('authorization', `Bearer ${dummyAuthToken}`)
      .expect(200);

    expect(response.body).toEqual({
      message: 'Notification deleted successfully',
    });
  });
});
