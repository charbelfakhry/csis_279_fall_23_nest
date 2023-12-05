import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthUserDto, RegisterUserDto } from './auth.dto';
import { SkipAuth } from './auth.guard';
import { ApiCreatedResponse, ApiResponse, ApiOkResponse } from '@nestjs/swagger/dist';
import { AuthService } from './auth.service';

/**
 * Type alias for the response body of the authenticateUser function.
 */
export type AuthenticateUserResponseBody = {
  access_token?: string;
  message: string;
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * No need to wrap in a try-catch.
   * Errors will be resolved to the appropriate
   * response codes by the default exception filter.
   *
   * @param loginDto user login credentials.
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOkResponse({description: 'User Logged in'})
  @ApiResponse({
    status: 400,
    description: 'Missing Data'})

  @ApiResponse({
    status: 401,
    description: 'Cannot login with these credentials'})

  @ApiResponse({
    status: 404,
    description: 'User does not exist'})
  @SkipAuth()
  async authenticateUser(
    @Body() loginDto: AuthUserDto,
  ): Promise<AuthenticateUserResponseBody> {
    /*
     * should return token, or throw an error that will be filtered.
     * No need for try-catch, exception filters will handle errs.
     * */
    const serviceResponse = await this.authService.signIn(
      loginDto?.email,
      loginDto?.password,
    );

    return {
      message: 'Success',
      ...serviceResponse,
    };
  }

  /**
   * No need to wrap in a try-catch.
   * Errors will be resolved to the appropriate
   * response codes by the default exception filter.
   *
   * @param registerUserDto
   */
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiCreatedResponse({description: 'User Registration'})
  @ApiResponse({
    status: 401,
    description: 'Username or Email already exist'})

  @SkipAuth()
  async addUser(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<AuthenticateUserResponseBody> {
    /*
     * should return token, or throw an error that will be filtered.
     * No need for try-catch, exception filters will handle errs.
     * */
    const serviceResponse = await this.authService.register(
      registerUserDto?.username,
      registerUserDto?.email,
      registerUserDto?.password,
    );

    return {
      message: 'Success',

      ...serviceResponse,
    };
  }
}
