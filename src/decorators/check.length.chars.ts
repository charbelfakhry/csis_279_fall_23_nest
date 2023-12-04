import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsLengthAndNoSpecialChars(minLength: number, maxLength: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLengthAndNoSpecialChars',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [minLength, maxLength],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [min, max] = args.constraints;
          const regex = new RegExp(`^[a-zA-Z0-9]{${min},${max}}$`);
          return typeof value === 'string' && regex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          const [min, max] = args.constraints;
          return `${args.property} must be between ${min} and ${max} characters long and contain no special characters`;
        },
      },
    });
  };
}
