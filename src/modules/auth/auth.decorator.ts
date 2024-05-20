import { SetMetadata } from '@nestjs/common';
import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsOtpCorrectAndValid, IsUniqueEmailRule } from './auth.constraints';

export const IS_PUBLIC = 'is_public'

const Public = () => SetMetadata(IS_PUBLIC, true);

export default Public;

/// Decorators ::::::::::
export function UserExist(status: boolean, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsUniqueEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [status],
      validator: IsUniqueEmailRule,
    });
  };
}

export function ConfirmPasswordOtp(_property?: any, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "ConfirmUserPassword",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsOtpCorrectAndValid,
    })
  }
}

