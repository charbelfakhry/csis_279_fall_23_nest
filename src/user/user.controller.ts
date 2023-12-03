import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getAll() {
    return await this.userService.findAll();
  }
}
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';

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

  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
