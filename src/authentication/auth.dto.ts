import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { IsLengthAndNoSpecialChars } from '../decorators/check.length.chars';

/**
 * DTO class for user authentication
 */
export class AuthUserDto {
    @IsEmail()
    email: string;
  
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

    @IsEmail()
    email: string;
  
    @IsLengthAndNoSpecialChars(4, 20)
    username: string;
  
    @IsStrongPassword()
    password: string;
  
    constructor(email: string, username: string, password: string) {
      this.email = email;
      this.username = username;
      this.password = password;
    }
  }