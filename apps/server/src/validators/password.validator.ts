import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchPassword', async: false })
export class MatchPassword implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const candidate = args.object;
    if (!candidate || typeof candidate !== 'object') {
      return false;
    }

    if (!('password' in candidate)) {
      return false;
    }

    const { password } = candidate as { password?: unknown };
    return typeof password === 'string' && password === confirmPassword;
  }

  defaultMessage() {
    return 'Passwords do not match';
  }
}
