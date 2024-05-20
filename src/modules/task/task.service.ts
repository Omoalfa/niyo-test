import { Injectable } from '@nestjs/common';
import { TaskPriority, Tasks, Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor (
    private readonly prismaService: PrismaService
  ) {}

  public createTask = async (user: Users, data: { name: string, time: Date, priority: TaskPriority }): Promise<Tasks> => {
    return await this.prismaService.tasks.create({ data: { ...data, user: { connect: { id: user.id }  } }});
  }

  public getTasks = async (user: Users): Promise<Tasks[]> => {
    const tasks = await this.prismaService.tasks.findMany({
      where: { user }
    })

    return tasks;
  }

  public getOneTask = async (user: Users, id: number): Promise<Tasks> => {
    return await this.prismaService.tasks.findFirst({ where: { user, id }})
  }

  public deleteTask = async (user: Users, id: number): Promise<void> => {
    await this.prismaService.tasks.delete({ where: { id, user }});
  }

  public updateTask = async (id: number, data: { name?: string, time?: Date, priority?: TaskPriority }): Promise<void> => {
    const { name, time, priority } = data;

    await this.prismaService.tasks.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(time && { time }),
        ...(priority && { priority }),
      }
    })
  }
}
