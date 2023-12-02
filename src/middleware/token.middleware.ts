import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

// And interface that allows the request to have a user property.
interface RequestWithUser extends Request {
  user: any; // Later on the 'User' type will be used instead
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  // Inject the JwtService to use the jewService object.
  constructor(private jwtService: JwtService) {}

  // Define the use function for NestMiddleware
  use(req: RequestWithUser, _: Response, next: NextFunction) {
    // Get the token from the request header and check is missing.
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // Verify the token and decode it and attach it to the request.
    try {
      req.user = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });
      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
