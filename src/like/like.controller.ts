import { Controller, Get } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Get('/')
  async getAll() {
    const likes = await this.likeService.findAll();
    return { likes };
  }
}