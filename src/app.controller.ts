import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { LoginUserDto } from './users/dto/login.user.dto';
import { RegisterUserDto } from './users/dto/register.user.dto';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  @Get()
  greeting() {
    return 'hello';
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @HttpCode(200)
  async login(
    @Body() loginUserData: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    Logger.log('login');
    Logger.log(loginUserData);
    const accessToken = await this.authService.login(loginUserData);

    response.cookie('Authorization', accessToken, { httpOnly: true });

    return HttpStatus.OK;
  }

  @Post('register')
  async register(@Body() registerUserdata: RegisterUserDto) {
    await this.usersService.register(registerUserdata);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() request: Request) {
    Logger.log(request.cookies['Authorization']);
    return request.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('Authorization');
    return HttpStatus.OK;
  }
}
