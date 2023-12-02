import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as path from 'path';
import * as process from 'process';

@Injectable()
export class ImageScheduleService {
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  eraseUnusedFiles() {
    const PATH_TO_IMAGES = path.join(process.cwd(), 'static', 'images');
  }
}
