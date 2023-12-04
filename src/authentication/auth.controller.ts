import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { SignInCredentials, SignUpUserInfo } from '../types/auth.types';
import { SkipAuth } from './auth.guard';

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
   * @param res HTTP response object.
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @SkipAuth()
  async authenticateUser(
    @Body() loginDto: SignInCredentials,
    @Res() res: Response<AuthenticateUserResponseBody>,
  ) {
    /*
     * should return token, or throw an error that will be filtered.
     * No need for try-catch, exception filters will handle errs.
     * */
    const serviceResponse = await this.authService.signIn(
      loginDto?.email,
      loginDto?.password,
    );

    /* pass result to response */
    res.status(HttpStatus.OK).json({
      message: 'Success',
      ...serviceResponse,
    });
  }

  /**
   * No need to wrap in a try-catch.
   * Errors will be resolved to the appropriate
   * response codes by the default exception filter.
   *
   * @param registerDto user register credentials.
   * @param res HTTP response object.
   */
  @HttpCode(HttpStatus.OK)
  @Post('register')
  @SkipAuth()
  async addUser(
    @Body() registerDto: SignUpUserInfo,
    @Res() res: Response<AuthenticateUserResponseBody>,
  ) {
    /*
     * should return token, or throw an error that will be filtered.
     * No need for try-catch, exception filters will handle errs.
     * */
    const serviceResponse = await this.authService.register(
      registerDto?.username,
      registerDto?.email,
      registerDto?.password,
    );

    /* pass result to response */
    res.status(HttpStatus.OK).json({
      message: 'Success',
      ...serviceResponse,
    });
  }
}
