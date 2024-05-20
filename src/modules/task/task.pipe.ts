import { ArgumentMetadata, BadRequestException, Inject, Injectable, PipeTransform } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TaskIdPipe implements PipeTransform {
  constructor (
    @Inject(PrismaService) private readonly prismaService: PrismaService
  ) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    const { id, context } = value;
    console.log(value)
    
    const task = await this.prismaService.tasks.findFirst({ where: { id: Number(id), user: context.user }});

    if (task) {
      return { id: Number(id) };
    } else {
      throw new BadRequestException("Task doesn't exist")
    }    
  }
}
