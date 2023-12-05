import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SkipAuth } from './auth.guard';
import { AuthService } from './auth.service';
import { RegisterUserDto, AuthUserDto } from './auth.dto';

/**
 * Type alias for the response body of the authenticateUser function.
 */
type AuthenticateUserResponseBody = {
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
