import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

/**
 * Name of the meta-data entry for the no-auth decorator.
 * */
const IS_NO_AUTH = 'isNoAuth';

/**
 * Decorator to use when you need to skip auth verification.
 * */
export const SkipAuth = () => SetMetadata(IS_NO_AUTH, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  /**
   * @param context execution context.
   * @returns true if the given request in the context is valid,
   *          else false.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    /* check for no-auth decorator */
    const isNoAuth = this.reflector.getAllAndOverride<boolean>(IS_NO_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);

    /* No authentication required */
    if (isNoAuth) {
      return true;
    }

    /* extract request from context */
    const request = context.switchToHttp().getRequest();

    /* extract token from request */
    const token: string | undefined = this.extractTokenFromHeader(request);

    /* check if token exists */
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      /* 💡
       * We're assigning the payload to the request object here
       * so that we can access it in our route handlers
       * */
      request['user'] = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY,
      });
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  /**
   * @param request HTTP request.
   * @returns the Bearer token in the request header if present.
   *          Otherwise, undefined.
   * @private
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    /* if not Bearer, return undefined */
    return type === 'Bearer' ? token : undefined;
  }
}
