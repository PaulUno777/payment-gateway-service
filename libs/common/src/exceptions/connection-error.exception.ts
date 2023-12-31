/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';

export class ConnectionErrorException extends HttpException {
  constructor(message = 'Database Connection Error') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
