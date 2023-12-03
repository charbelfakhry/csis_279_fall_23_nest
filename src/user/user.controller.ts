import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { RequestWithUser } from '../middleware/token.middleware';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getAll() {
    return await this.userService.findAll();
  }

  @Get('/users-by-username/:username')
  async getUsersByUsername(@Param('username') username: string) {
    return this.userService.findUsersByUsername(username);
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }
  @Get('/by-username/:username')
  async getUserByUsername(@Param('username') username: string) {
    return this.userService.findOneByUsername(username);
  }

  @Post()
  async addUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @Put()
  async updateUser(@Body() id: string, @Body() user: UpdateUserDto) {
    return this.userService.updateUser(id, user);
  }

  @Put('profile')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }]))
  async changeProfileImage(
    @UploadedFiles() file: { avatar?: Express.Multer.File[] },
    @Req() req: RequestWithUser,
  ) {
    const user = req.user;
    console.log(file, user);
  }

  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
