import { Body, Controller, Logger, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { SignInCredentials, SignUpUserInfo } from 'src/types/auth.types';
import { AuthService } from './auth.service';
import { HttpStatusCode } from '../types/http.types';
import { AppController } from '../app.controller';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AppController.name);
  constructor(private authService: AuthService) {}

  @Post('login')
  async authenticateUser(
    @Body('user') user: SignInCredentials | null,
    @Res() res: Response,
  ) {
    try {
      // Check if the user is empty
      if (!user) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: 'Missing Data' });
      }

      // Call the authService authenticate function to generate the JWT token.
      const result = await this.authService.authenticate(user);

      if (result.status !== HttpStatusCode.OK) {
        return res.status(result.status).json({ message: result.message });
      }

      // Send the token and the user information back to the client-side.
      return res
        .status(HttpStatusCode.OK)
        .json({ message: result.message, user: result.user, token: result.token });
    } catch (error) {
      // Log the error
      this.logger.fatal(error);
      return res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error' });
    }
  }

  @Post('signup')
  async addUser(
    @Body('user') user: SignUpUserInfo | null,
    @Res() res: Response,
  ) {
    try {
      // Validate the presence of user data
      if (!user) {
        // Respond with a Bad Request status if user data is missing
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: 'Missing Data' });
      }

      // Call the addUser function from authService and generate the JWT token
      const result = await this.authService.addUser(user);

      if (result.status !== HttpStatusCode.OK) {
        return res.status(result.status).json({ message: result.message });
      }

      // Sending the success response with token and user data
      return res
        .status(HttpStatusCode.OK)
        .json({ message: result.message, user: result.user, token: result.token });
    } catch (error) {
      // Log the error
      this.logger.fatal(error);
      return res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }
  }
}
