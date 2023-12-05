import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { JwtClaims } from './middleware.types';

// An interface that allows the request to have a user property.
export interface RequestWithUser extends Request {
  userEntity: User;
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  // Inject the JwtService to use the jewService object.
  constructor(
    private jwtService: JwtService,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  // Define the use function for NestMiddleware
  async use(req: RequestWithUser, _: Response, next: NextFunction) {
    // Get the token from the request header and check is missing.
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // Verify the token and decode it and attach it to the request.
    try {
      const claims = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      }) as JwtClaims;
      const user = await this.userRepository.findOneBy({ user_id: claims.sub });
      if (!user) {
        throw new UnauthorizedException('User does not exist.');
      }
      req.userEntity = user;
      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
