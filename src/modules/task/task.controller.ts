import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseInterceptors, UsePipes } from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthRequest } from '../auth/auth.controller';
import { CreateTaskDto, TaskParamDto, UpdateTaskDto } from './task.dto';
import { ContextInterceptor } from './context.interceptor';
import { TaskIdPipe } from './task.pipe';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('task')
@UseInterceptors(ContextInterceptor)
export class TaskController {
  constructor (
    private readonly taskService: TaskService
  ) {}

  @Post()
  async createTask (
    @Req() req: AuthRequest,
    @Body() data: CreateTaskDto 
  ) {
    const task = await this.taskService.createTask(req.user, data);

    return { msg: "Task created successfully", data: task }
  } 

  @Get()
  async getTasks (
    @Req() req: AuthRequest
  ) {
    const tasks = await this.taskService.getTasks(req.user);

    return { msg: "Tasks fetched successfully", data: tasks }
  } 

  @Patch("/:id")
  async editTaskDetails (
    @Req() req: AuthRequest,
    @Param(TaskIdPipe) params: TaskParamDto,
    @Body() data: UpdateTaskDto
  ) {
    const { id } = params;
    const tasks = await this.taskService.updateTask(id, data);

    return { msg: "Tasks fetched successfully", data: tasks }
  }

  @Get("/:id")
  async getTaskDetails (
    @Req() req: AuthRequest,
    @Param(TaskIdPipe) params: TaskParamDto
  ) {
    const { id } = params;
    const tasks = await this.taskService.getOneTask(req.user, id);

    return { msg: "Tasks fetched successfully", data: tasks }
  }

  @Delete("/:id")
  async deleteTask (
    @Req() req: AuthRequest,
    @Param(TaskIdPipe) params: TaskParamDto
  ) {
    const { id } = params;
    const tasks = await this.taskService.deleteTask(req.user, id);

    return { msg: "Tasks fetched successfully", data: tasks }
  }
}
