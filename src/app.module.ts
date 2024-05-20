import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/task/task.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import configFunction from './config';
import TokenModule from './providers/token/token.module';
import MailModule from './providers/mail/mail.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './modules/auth/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configFunction],
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule, 
    TaskModule, 
    TokenModule,
    MailModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard
    },
  ],
})
export class AppModule {}
