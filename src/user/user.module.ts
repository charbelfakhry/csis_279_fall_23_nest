import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { userProviders } from './user.providers';
import { DatabaseModule } from '../database.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { pictureProviders } from '../picture/picture.providers';
import { PictureService } from '../picture/picture.service';

@Module({
  imports: [DatabaseModule, JwtModule],
  controllers: [UserController],
  providers: [
    JwtService,
    UserService,
    PictureService,
    ...userProviders,
    ...pictureProviders,
  ],
  exports: [UserService],
})
export class UserModule {}
