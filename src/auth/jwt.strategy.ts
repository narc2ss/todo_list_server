import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, Req } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
Logger.log(SECRET_KEY);

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies['Authorization'],
      ]),
      ignoreExpiration: false,
      secretOrKey: SECRET_KEY,
    });
  }
  async validate(payload: any) {
    Logger.log('jwt validate');
    Logger.log(payload.username);
    const user = await this.usersService.findOne({
      username: payload.username,
    });

    delete user.password;

    return user;
  }
}
