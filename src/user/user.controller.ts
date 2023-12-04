import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './user.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { RequestWithUser } from '../middleware/token.middleware';
import { diskStorage } from 'multer';
import e from 'express';
import { resolve } from 'path';
import { PictureService } from '../picture/picture.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly pictureService: PictureService,
  ) {}

  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }
  @Get('/:username')
  async getUserByUsername(@Param('username') username: string) {
    return this.userService.findOneByUsername(username);
  }

  @Put()
  async updateUser(@Body() id: string, @Body() user: UpdateUserDto) {
    return this.userService.updateUser(id, user);
  }

  /**
   * Handles profile picture change.
   * @param file
   * @param req
   */
  @Put('profile')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }], {
      storage: diskStorage({
        destination: resolve('static', 'images'),
        /**
         * Provides a unique name for each file.
         * @param _
         * @param file
         * @param cb
         */
        filename(
          _: e.Request,
          file: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void,
        ) {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileNameExtension = '.' + file.originalname.split('.').at(-1);
          cb(null, file.fieldname + '-' + uniqueSuffix + fileNameExtension);
        },
      }),
    }),
  )
  async changeProfileImage(
    @UploadedFiles() file: { avatar?: Express.Multer.File[] },
    @Req() req: RequestWithUser,
  ) {
    const user = req.userEntity;
    const { avatar } = file;

    if (!avatar || avatar.length === 0)
      throw new BadRequestException('Bad request');

    const img = avatar[0];

    const pic = await this.pictureService.insertPicture(img.filename);
    req.userEntity = await this.userService.updateProfile(user, pic);
  }

  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
