/**************************************************************************************
 * File: user.dto.ts
 * Author: Tony Hallal
 * Date: 12/3/2023
 * Description: Contains all user data transfer objects: CreateUserDto, UpdateUserDto,
 * AuthUserDto, GetUserDto.
 ***************************************************************************************/

import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

/**
 * DTO class for user creation
 */
export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password_hash: string;

  @IsNotEmpty()
  full_name: string;

  bio?: string;

  profile_picture_url?: string;

  constructor(
    username: string,
    email: string,
    password: string,
    fullName: string,
    bio: string,
    profile_picture_url: string,
  ) {
    this.username = username;
    this.email = email;
    this.password_hash = password;
    this.full_name = fullName;
    this.bio = bio;
    this.profile_picture_url = profile_picture_url;
  }
}

/**
 * Dto class for user update
 */
export class UpdateUserDto {
  username?: string;

  @IsEmail()
  email?: string;

  @IsStrongPassword()
  password_hash?: string;

  full_name?: string;

  bio?: string;

  profile_picture_url?: string;

  constructor(
    username: string,
    email: string,
    password: string,
    fullName: string,
    bio: string,
    profile_picture_url?: string,
  ) {
    this.username = username;
    this.email = email;
    this.password_hash = password;
    this.full_name = fullName;
    this.bio = bio;
    this.profile_picture_url = profile_picture_url;
  }
}

/**
 * DTO class for user authentication
 */
export class AuthUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password_hash: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password_hash = password;
  }
}
