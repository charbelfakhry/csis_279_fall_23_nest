import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { IsLengthAndNoSpecialChars } from '../decorators/check.length.chars';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO class for user authentication
 */
export class AuthUserDto {

  @ApiProperty({
    description: 'email for the account',
    example: 'jhon.doe@gmail.com',
  })  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'password for the account',
    example: 'passWord123!',
  })
  @IsNotEmpty()
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

/**
 * DTO class for user registration
 */
export class RegisterUserDto {

  @ApiProperty({
    description: 'email for the account',
    example: 'jhon.doe@gmail.com',
  })

  @IsEmail()
  email: string;


  @ApiProperty({
    description: 'username for the account',
    example: 'johndoe',
  })
  @IsLengthAndNoSpecialChars(4, 20)
  username: string;

  @ApiProperty({
    description: 'password for the account',
    example: 'passWord123!',
  })
  
  @IsStrongPassword()
  password: string;

  constructor(email: string, username: string, password: string) {
    this.email = email;
    this.username = username;
    this.password = password;
  }
}
