/* eslint-disable prettier/prettier */
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsCurrencyCode(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    const validCurrencyCodes = ['EUR', 'USD', 'XAF']; // Add more if necessary
    registerDecorator({
      name: 'IsCurrencyCode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return validCurrencyCodes.includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid currency code, availables ${validCurrencyCodes})`;
        },
      },
    });
  };
}
