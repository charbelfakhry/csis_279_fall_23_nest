import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { IsLengthAndNoSpecialChars } from 'src/decorators/check.length.chars';

/**
 * DTO class for user creation
 */
export class CreateUserDto {
  @ApiProperty({
    description: 'username for the account',
    example: 'Jhon Doe',
  })

  @IsLengthAndNoSpecialChars(4, 20)
  username?: string;


  @ApiProperty({
    description: 'email for the account',
    example: 'jhon.doe@gmail.com',
  })

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password_hash: string;

  @IsLengthAndNoSpecialChars(4, 30)
  full_name: string;

  @IsLengthAndNoSpecialChars(1, 200)
  bio?: string;

  @IsNotEmpty()
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

  @IsLengthAndNoSpecialChars(4, 20)
  username?: string;

  @IsEmail()
  email?: string;

  @IsStrongPassword()
  password_hash?: string;

  @IsLengthAndNoSpecialChars(4, 30)
  full_name?: string;

  @IsLengthAndNoSpecialChars(1, 200)
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

  @IsLengthAndNoSpecialChars(4, 20)
  username: string;

  @IsNotEmpty()
  password_hash: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password_hash = password;
  }
}
