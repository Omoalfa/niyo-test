import { PipeTransform, Injectable, ArgumentMetadata, Inject, BadRequestException } from '@nestjs/common';
import { LoginUserDto } from './auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcryptjs";

@Injectable()
export class LoginPipe implements PipeTransform {
  constructor (
    @Inject(PrismaService) private readonly prismaService: PrismaService
  ) {}
  async transform(value: LoginUserDto, metadata: ArgumentMetadata) {
    const { email, pwd } = value;
    
    const user = await this.prismaService.users.findFirst({
      where: { email }
    })

    if (user && bcrypt.compareSync(pwd, user.pwd)) {
      return {
        email, pwd, id: user.id
      }
    }

    throw new BadRequestException("Invalid credentials")
  }
}