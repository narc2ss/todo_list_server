import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/entity/user.entity';
import { AddTodoDto } from './dto/add.todo.dto';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllTodos(@Req() request: Request) {
    const user = request.user as User;
    return this.todosService.getAllTodos(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  addTodo(@Req() request: Request, @Body() addTodoData: AddTodoDto) {
    Logger.log('addTodo');
    Logger.log(request.user);
    const user = request.user as User;
    return this.todosService.addTodo(user, addTodoData);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  toggleTodo(@Req() request: Request, @Param('id') id: number) {
    const user = request.user as User;
    return this.todosService.toggleTodo(user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteTodo(@Req() request: Request, @Param('id') id: number) {
    const user = request.user as User;
    this.todosService.deleteTodo(user, id);

    return this.todosService.getAllTodos(user);
  }
}
