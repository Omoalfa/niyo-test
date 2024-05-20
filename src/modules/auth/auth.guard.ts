import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { IncomingMessage } from "http";
import TokenService from "src/providers/token/token.service";
import { IS_PUBLIC } from "./auth.decorator";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    const request = this.getRequest<
      IncomingMessage & { user?: Record<string, unknown> }
    >(context); // you could use FastifyRequest here too

    try {
      const token = this.getToken(request);
      const user = this.tokenService.decodeToken(token);
      request.user = await this.prismaService.users.findFirst({ where: { id: user.id, email: user.email }});
      return true;
    } catch (e) {
      // return false or throw a specific error if desired
      throw new UnauthorizedException("Unauthorized request")
    }
  }

  protected getRequest<T>(context: ExecutionContext): T {
    return context.switchToHttp().getRequest();
  }
  
  protected getToken(request: {
    headers: Record<string, string | string[]>;
  }): string {
    const authorization = request.headers['authorization'];
    if (!authorization || Array.isArray(authorization)) {
      throw new Error('Invalid Authorization Header');
    }
    const [_, token] = authorization.split(' ');
    return token;
  }
}