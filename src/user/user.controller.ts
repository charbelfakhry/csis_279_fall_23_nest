import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
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
import { generateUniqueFileName } from '../utils/utils.files';
import { PictureService } from '../picture/picture.service';

import { ApiBadRequestResponse, ApiOkResponse, ApiResponse } from '@nestjs/swagger/dist';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly pictureService: PictureService,
  ) { }


  @ApiOkResponse({ description: 'found user' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No such user'
  })

  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findOneById(id);
    if (!user) throw new NotFoundException('No such user');
    return {
      username: user.username,
      profilePicture: user.profilePicture,
      bio: user.bio,
      email: user.email,
    };
  }

  @ApiOkResponse({ description: 'found user' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No such user'
  })
  @Get('/:username')
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.userService.findOneByUsername(username);
    if (!user) throw new NotFoundException('No such user.');
    return {
      username: user.username,
      profilePicture: user.profilePicture,
      bio: user.bio,
      email: user.email,
    };
  }

  @ApiOkResponse({ description: 'updated user' })
  @Put()
  async updateUser(
    @Body() userUpdate: UpdateUserDto,
    @Req() req: RequestWithUser,
  ) {
    const user = req.userEntity;
    return this.userService.updateUser(user, userUpdate);
  }

  /**
   * Handles profile picture change.
   * @param file
   * @param req
   */
  @ApiOkResponse({ description: 'updated profile picture' })
  @ApiBadRequestResponse({description: 'profile picture not updated'})

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
          cb(null, generateUniqueFileName(file.originalname));
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

  @ApiOkResponse({ description: 'user deleted' })
  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
