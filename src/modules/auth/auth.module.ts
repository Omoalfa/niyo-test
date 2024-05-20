import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import MailModule from 'src/providers/mail/mail.module';
import TokenModule from 'src/providers/token/token.module';
import { IsOtpCorrectAndValid, IsUniqueEmailRule } from './auth.constraints';

@Module({
  imports: [PrismaModule, MailModule, TokenModule],
  providers: [AuthService, IsUniqueEmailRule, IsOtpCorrectAndValid],
  controllers: [AuthController]
})
export class AuthModule {}
