/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';

export class ServiceUnavailableException extends HttpException {
  constructor(
    message = 'This Service is currently unavailable for this provider',
  ) {
    super(message, HttpStatus.SERVICE_UNAVAILABLE);
  }
}
