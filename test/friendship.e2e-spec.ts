import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express'; 
import { AppModule } from '../src/app.module'; 

describe('FriendshipController (e2e)', () => {
  let app: NestExpressApplication; 

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>(); 
    await app.init();
  });

  it('/friendships (GET)', () => {
    return request(app.getHttpServer())
      .get('/friendships')
      .expect(200)
      .expect({ friendships: [] });
  });

  

  afterAll(async () => {
    await app.close();
  });
});
