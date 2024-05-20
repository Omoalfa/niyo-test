import { TaskPriority } from "@prisma/client";
import { IsEnum, IsISO8601, IsIn, IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
  @IsString() name: string;
  @IsISO8601() time: Date;
  @IsEnum(TaskPriority) priority: TaskPriority
}

export class UpdateTaskDto {
  @IsOptional() @IsString() name: string;
  @IsOptional() @IsISO8601() time: Date;
  @IsOptional() @IsIn(Object.values(TaskPriority)) priority: TaskPriority
}

export class TaskParamDto {
  id: number;
}
