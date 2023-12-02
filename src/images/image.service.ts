import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as path from 'path';
import * as process from 'process';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  eraseUnusedFiles() {
    const PATH_TO_IMAGES = path.join(process.cwd(), 'static', 'images');
    this.logger.debug(`DELETING UNUSED IMAGES FROM ${PATH_TO_IMAGES}`);
  }

  generateDefaultProfilePicture() {}
}
