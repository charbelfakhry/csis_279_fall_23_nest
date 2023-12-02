import { Body, Controller, Logger, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { SignInCredentials, SignUpUserInfo } from 'src/types/auth.types';
import { AuthService } from './auth.service';
import { HttpStatusCode } from '../types/http.types';
import { AppController } from '../app.controller';
import * as http from 'http';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AppController.name);
  constructor(private authService: AuthService) {}

  @Post('authenticate')
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

      // Call the authService's authenticate function.
      const result = await this.authService.authenticate(user);

      if (result.status !== HttpStatusCode.OK) {
        return res.status(result.status).json({ message: result.message });
      }

      // Generate the JWT token.
      let token: string;
      try {
        token = jwt.sign(
          { user_id: result.user!.user_id },
          process.env.SECRET_KEY,
        );
      } catch (tokenError) {
        return res
          .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error generating token' });
      }

      // Send the token and the user information back to the client-side.
      return res
        .status(HttpStatusCode.OK)
        .json({ message: result.message, user: result.user, token: token });
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

      // Calling the addUser function from authService
      const result = await this.authService.addUser(user);

      if (result.status !== HttpStatusCode.OK) {
        return res.status(result.status).json({ message: result.message });
      }

      let token: string;
      try {
        // Generating JWT token
        token = jwt.sign(
          { user_id: result.user!.user_id },
          process.env.SECRET_KEY,
        );
      } catch (tokenError) {
        // Handling token generation errors
        return res
          .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error generating token' });
      }

      // Sending the success response with token and user data
      return res
        .status(HttpStatusCode.OK)
        .json({ message: result.message, user: result.user, token: token });
    } catch (error) {
      // Log the error
      this.logger.fatal(error);
      return res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }
  }
}
