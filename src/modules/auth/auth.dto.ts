import { IsEmail, IsInt, IsString, IsStrongPassword } from "class-validator";
import { ConfirmPasswordOtp, UserExist } from "./auth.decorator";

export class CreateUserDto {
  @IsString() name: string;
  @IsEmail() @UserExist(false) email: string;
  @IsStrongPassword() pwd: string;
} 

export class LoginUserDto {
  @IsEmail() email: string;
  @IsStrongPassword() pwd: string;
}

export class ForgetPasswordDto {
  @IsEmail() @UserExist(true) email: string;
}

export class UpdatePasswordDto {
  @IsEmail() email: string;
  @IsString() @ConfirmPasswordOtp() otp: string;
  @IsStrongPassword() pwd: string;
}
