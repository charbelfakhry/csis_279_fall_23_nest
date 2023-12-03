import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Picture } from './picture.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as path from 'path';
import * as fs from 'fs/promises';
import { cwd } from 'node:process';

@Injectable()
export class PictureService {
  private readonly logger = new Logger(PictureService.name);

  /**
   * This function is called once a day at midnight, logs a debug message stating that it's deleting unused images,
   * then does a set difference between the images in the database and the images saved locally and deletes the images
   * that only exists locally.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async eraseUnusedFiles() {
    const PATH_TO_IMAGES = path.join(cwd(), 'static', 'images');
    this.logger.debug(`DELETING UNUSED IMAGES FROM ${PATH_TO_IMAGES}`);
    const allPhotos = new Set(
      (await this.pictureRepository.find()).map((pic) => pic.picture_url),
    );
    const allSavedPhotos = new Set(await fs.readdir(PATH_TO_IMAGES));
    const toDelete = new Set(
      [...allSavedPhotos].filter((x) => !allPhotos.has(x)),
    );

    for (const photo of toDelete) {
      await fs.rm(path.join(PATH_TO_IMAGES, photo));
    }
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
