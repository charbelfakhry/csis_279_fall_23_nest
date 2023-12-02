import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Picture } from './picture.entity';

@Injectable()
export class PictureService {
  constructor(
    @Inject('PICTURE_REPOSITORY')
    private pictureRepository: Repository<Picture>,
  ) {}

  /**
   * This function is an example of how to use the repository in a service.
   */
  async findAll(): Promise<Picture[]> {
    return this.pictureRepository.find();
  }
}
