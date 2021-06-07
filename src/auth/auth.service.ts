import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/users/dto/login.user.dto';
import { RegisterUserDto } from 'src/users/dto/register.user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    // Logger.log(username, 'hello');
    const user = await this.usersService.findOne({ username });

    if (!user) return null;
    if (user.password !== password) return null; // TODO: 나중에 bcrypt로 암호화 하기

    delete user.password;

    // Logger.log(user);

    return user;
  }

  async login(loginUserData: LoginUserDto) {
    const payload = { username: loginUserData.username };
    return await this.jwtService.signAsync(payload);
  }
}
