import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * @param email email of the user to sign in.
   * @param pass un-hashed user password to sign in.
   * @returns an object containing a user token valid for
   *          the duration specified in the environment.
   * @throws UnauthorizedException if the credentials are invalid.
   * @throws NotFoundException if the user does not exist.
   * @throws BadRequestException if any data is missing.
   * @throws HttpException with HttpStatus.INTERNAL_SERVER_ERROR for other errors.
   */
  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    /* check for missing data */
    if (!email || !pass) {
      /* status code is 400 */
      throw new BadRequestException('Missing Data');
    }

    /* fetch user */
    const user: User | null = await this.userService.findByEmail(email);

    /* Check if user exists */
    if (!user) {
      /* status code is 404 */
      throw new NotFoundException('User does not exist');
    }

    /* stores the hashed raw-password */
    let hashed_pass: string;

    try {
      /* Hash the given password
       * TODO write a common hash function in the UserService & use it here.
       * */
      hashed_pass = await hash(pass, 15);
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    /* Check for mismatch */
    if (user.password_hash !== hashed_pass) {
      /* status code is 401 */
      throw new UnauthorizedException('Cannot login with these credentials');
    }

    /* payload to be added to the JWT token */
    const payload = { sub: user.user_id, email: user.email };

    /* status code defined in controller */
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  /**
   * @param username
   * @param email
   * @param pass
   * @param full_name
   * @param bio
   * @param pfl_pic_url profile picture url.
   * @returns an object containing a user token valid for
   *          the duration specified in the environment.
   * @throws UnauthorizedException if username is not unique or if email is not unique.
   * @throws BadRequestException if any data is missing.
   * @throws HttpException with HttpStatus.INTERNAL_SERVER_ERROR for other errors.
   */
  async register(
    username: string,
    email: string,
    pass: string,
    full_name: string,
    bio: string,
    pfl_pic_url: string,
  ): Promise<{ access_token: string }> {
    /* check for missing data */
    if (!username || !email || !pass || !full_name || !bio || !pfl_pic_url) {
      /* status code is 400 */
      throw new BadRequestException('Missing Data');
    }

    /* check if the email is in use.
     * Note that this check is not necessary,
     * but this is the only way to know wehther the username is taken,
     * or email.
     *  */
    const usernameUser: User | null =
      await this.userService.findOneByUsername(username);

    /* check if already exists */
    if (usernameUser) {
      /* status code is 401 */
      throw new UnauthorizedException('Username exists');
    }

    /* check if email is taken */
    const emailUser: User | null = await this.userService.findByEmail(email);

    /* check if already exists */
    if (emailUser) {
      /* status code is 401 */
      throw new UnauthorizedException('Email exists');
    }

    try {
      /* try to create user */
      const user: User = await this.userService.createUser({
        username: username,
        email: email,
        password_hash: pass,
        full_name: full_name,
        bio: bio,
        profile_picture_url: pfl_pic_url,
      });

      return await this.signIn(user.email, pass);
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
