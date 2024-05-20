import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public generateToken = (data: { email: string, id: number }): string => {
    return this.jwtService.sign(data, {
      secret: this.configService.get<string>("jwt.auth_secret"),
      expiresIn: '1h'
    })
  }

  public generatePwdToken = (data: { email: string, otp: string }): string => {
    return this.jwtService.sign(data, {
      secret: this.configService.get<string>("jwt.secret"),
      expiresIn: '15m'
    })
  }

  public decodeToken = (token: string): { email: string, id: number } => {
    const decoded = this.jwtService.verify(token, { secret: this.configService.get<string>("jwt.auth_secret") })

    return decoded;
  }

  public decodePwdToken = (token: string): { email: string, otp: string } => {
    const decoded = this.jwtService.verify(token, { secret: this.configService.get<string>("jwt.secret") })

    return decoded;
  }
}

export default TokenService;
