// app.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
})
export class AppModule {}
