import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
require('dotenv').config();

let port = process.env.APP_PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port || 3000);
}
bootstrap();