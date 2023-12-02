import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Picture } from './picture.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import path from 'path';
import process from 'process';

@Injectable()
export class PictureService {
  private readonly logger = new Logger(PictureService.name);
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  eraseUnusedFiles() {
    const PATH_TO_IMAGES = path.join(process.cwd(), 'static', 'images');
    this.logger.debug(`DELETING UNUSED IMAGES FROM ${PATH_TO_IMAGES}`);
  }

  constructor(
    @Inject('PICTURE_REPOSITORY')
    private pictureRepository: Repository<Picture>,
  ) {}

  generateDefaultProfilePicture() {}

  /**
   * This function is an example of how to use the repository in a service.
   */
  async findAll(): Promise<Picture[]> {
    return this.pictureRepository.find();
  }
}
