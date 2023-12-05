import * as dotenv from 'dotenv';
dotenv.config();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import helmet from 'helmet';

const port = process.env.APP_PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(helmet());

  const options = new DocumentBuilder()
  .setTitle('Social Media App')
  .setDescription('description')
  .setVersion('1.0.0')
  .build()

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document)

  await app.listen(port || 3000);
}
bootstrap();
