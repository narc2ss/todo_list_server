import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { AddTodoDto } from './dto/add.todo.dto';
import { ToggleTodoDto } from './dto/toggle.todo.dto';
import { Todo } from './entity/todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,
    private readonly usersService: UsersService,
  ) {}
  async addTodo(user: User, addTodoData: AddTodoDto) {
    await this.todoRepository.save({
      content: addTodoData.content,
      active: false,
      user: await this.usersService.findOne(user.id),
    });

    return await this.getAllTodos(user);
  }

  async getAllTodos(user: User) {
    return await this.todoRepository.find({ where: { user } });
  }

  async toggleTodo(user: User, id: number) {
    const todo = await this.getTodoById(id);
    if (!todo) throw new BadRequestException();

    todo.active = !todo.active;

    await this.todoRepository.save(todo);

    return await this.getAllTodos(user);
  }

  async deleteTodo(user: User, id: number) {
    await this.todoRepository.delete(id);

    return await this.getAllTodos(user);
  }

  async getTodoById(id: number) {
    return await this.todoRepository.findOne(id);
  }
}
