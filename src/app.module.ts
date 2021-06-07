import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/entity/user.entity';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { TodosModule } from './todos/todos.module';
import * as dotenv from 'dotenv';
import { Todo } from './todos/entity/todo.entity';
import { TodosController } from './todos/todos.controller';
import { TodosService } from './todos/todos.service';

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

@Module({
  imports: [
    ConfigModule.forRoot(),
    MorganModule,
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: DB_HOST,
      port: parseInt(DB_PORT, 10),
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME,
      entities: [User, Todo],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    TodosModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: MorganInterceptor('combined') },
    AuthService,
  ],
})
export class AppModule {}
