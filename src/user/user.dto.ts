import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { IsLengthAndNoSpecialChars } from '../decorators/check.length.chars';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO class for user creation
 */
export class CreateUserDto {
  

  @IsLengthAndNoSpecialChars(4, 20)
  username?: string;




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

  @ApiProperty({
    description: 'username is valid',
    example: 'jhondoe',
  })
  @IsLengthAndNoSpecialChars(4, 20)
  username?: string;


  @ApiProperty({
    description: 'email for the account',
    example: 'jhon.doe@gmail.com',
  })

  @IsEmail()
  email?: string;


  @ApiProperty({
    description: 'password is strong',
    example: 'passWord123!',
  })

  @IsStrongPassword()
  password_hash?: string;

  @ApiProperty({
    description: 'name is valid',
    example: 'Jhon Doe',
  })


  @IsLengthAndNoSpecialChars(4, 30)
  full_name?: string;

  @ApiProperty({
    description: 'bio is valid',
    example: 'my life is meaningless',
  })


  @IsLengthAndNoSpecialChars(1, 200)
  bio?: string;

  constructor(
    username: string,
    email: string,
    password: string,
    fullName: string,
    bio: string,
  ) {
    this.username = username;
    this.email = email;
    this.password_hash = password;
    this.full_name = fullName;
    this.bio = bio;
  }
}
