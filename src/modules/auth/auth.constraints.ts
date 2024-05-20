import { Inject, Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcryptjs";
import TokenService from "src/providers/token/token.service";

//Constraints ::::::
@ValidatorConstraint({ name: 'UniqueEmail', async: true })
@Injectable()
export class IsUniqueEmailRule implements ValidatorConstraintInterface {
  constructor(@Inject(PrismaService) private readonly prismaService: PrismaService) {}

  async validate(email: string, args: ValidationArguments) {
    try {
      const [status] = args.constraints;
      const exist = await this.prismaService.users.findFirst({
        where: { email }
      });

      if (status && exist) {
        return true;
      } else if (!status && !exist) {
        return true
      } else {
        return false
      }
    } catch (e) {
      console.log(e)
      return false;
    }
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return validationArguments.constraints[0] ? "User does not exist" : "Email already in use!"
  }
}

@ValidatorConstraint({ name: "ConfirmOtp", async: true })
@Injectable()
export class IsOtpCorrectAndValid implements ValidatorConstraintInterface {
  constructor (
    @Inject(PrismaService) private readonly prismaService: PrismaService,
    @Inject(TokenService) private readonly tokenService: TokenService,
  ) {}

  async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
    const email = validationArguments.object["email"];

    const user = await this.prismaService.users.findFirst({
      where: { email }
    })

    if (user && user.pwdToken) {
      const { otp } = this.tokenService.decodePwdToken(user.pwdToken);

      return otp === value;
    }

    return false;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "Invalid password otp!"
  }
}
