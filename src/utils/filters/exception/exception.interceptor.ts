import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ExceptionInterceptor implements ExceptionFilter {
  private logger: Logger = new Logger(ExceptionInterceptor.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    this.logger.fatal(exception);
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || exception.message;

      if (Array.isArray(message)) {
        message = message[0];
      }
    }

    response.status(status).json({
      data: null,
      status,
      message,
      timestamp: new Date().getTime(),
      path: ctx.getRequest().url,
    });
  }
}
