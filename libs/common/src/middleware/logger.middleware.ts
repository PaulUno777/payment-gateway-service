/* eslint-disable prettier/prettier */
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(`HTTP`);
  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;

    response.on('finish', () => {
      const { statusCode } = response;
      const textlog = {
        request: `${method} ${originalUrl}`,
        statusCode: statusCode,
        responseLength: response.get('response-length'),
      };
      if (method !== 'GET') {
        textlog['Body'] = request.body;
      }
      this.logger.log(textlog);
    });

    next();
  }
}
