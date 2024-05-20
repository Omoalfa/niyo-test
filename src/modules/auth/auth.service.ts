import { Injectable } from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcryptjs";
import { nanoid } from 'nanoid';
import TokenService from 'src/providers/token/token.service';
import MailService from 'src/providers/mail/mail.service';

@Injectable()
export class AuthService {
  constructor (
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService
  ) {}
  
  public createUser = async (data: Prisma.UsersCreateInput): Promise<Users> => {
    const pwd = bcrypt.hashSync(data.pwd, 10)

    return await this.prismaService.users.create({ data: { ...data, pwd } });
  }

  public getLoginToken = (data: { id: number, email: string }): String => {
    return this.tokenService.generateToken(data);
  }

  public forgetPassword = async (email: string): Promise<void> => {
    const otp = nanoid(4);

    const pwdToken = this.tokenService.generatePwdToken({otp, email});

    await this.prismaService.users.update({ where: { email }, data: { pwdToken }});

    await this.mailService.sendPasswordMail(email, otp);
  }

  public updatePassword = async (email: string, password: string) => {
    await this.prismaService.users.update({
      where: { email },
      data: { pwd: bcrypt.hashSync(password, 10), pwdToken: null }
    })
  }
}
