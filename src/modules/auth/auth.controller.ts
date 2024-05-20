import { Body, Controller, Get, Patch, Post, Req, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, ForgetPasswordDto, LoginUserDto, UpdatePasswordDto } from './auth.dto';
import Public from './auth.decorator';
import { Request } from 'express';
import { Users } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { LoginPipe } from './auth.pipe';

export interface AuthRequest extends Request {
  user: Users
}

@Controller('auth')
@ApiTags('Authorization and Authentication')
export class AuthController {
  constructor (
    private readonly authService: AuthService
  ) {}

  @Post()
  @Public()
  async signup (
    @Body() data: CreateUserDto
  ) {
    const user = await this.authService.createUser(data);

    return { msg: "User created successfully", data: user }
  }

  @Post("/login")
  @Public()
  @UsePipes(LoginPipe)
  async login (
    @Body() data: LoginUserDto,
  ) {
    const { email, id } = data as any;
    const token = this.authService.getLoginToken({ email, id })

    return { msg: "User loggend in successfully", data: { token } }
  }
  
  @Post("/forget")
  @Public()
  async forgetPassword (
    @Body() data: ForgetPasswordDto
  ) {
    const { email } = data;

    await this.authService.forgetPassword(email);

    return { msg: "Recovery token was sent to your email" }
  }

  @Patch("/pwd")
  @Public()
  async updatePassword (
    @Body() data: UpdatePasswordDto
  ) {
    await this.authService.updatePassword(data.email, data.pwd);

    return { msg: "Password updated successfully" }
  }
}
