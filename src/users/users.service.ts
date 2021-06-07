import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register.user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  findOne(condition: any) {
    Logger.log('findOne', JSON.stringify(condition));
    return this.userRepository.findOne(condition);
  }

  async register(registerUserData: RegisterUserDto) {
    await this.userRepository.save(registerUserData);
  }
}
