import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

interface StandardError {
  statusCode: number;
  message: string | string[];
  error: string;
}
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(err: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '';
    let info = err;
    console.log(err);

    if (err instanceof HttpException) {
      statusCode = err.getStatus();
      const response = err.getResponse() as StandardError;
      message =
        typeof response.message === 'string'
          ? response.message
          : response.message[0] || err.message;
      info = null;
    } else {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const errMsgMap = {
          P2002: `${err.meta.target} dupicated`,
          P2025: err.meta.cause,
        };

        statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
        message = errMsgMap[err.code] || '';
      }
    }
    console.log(err);
    response.status(statusCode).json({
      statusCode,
      path: request.url,
      message,
      info,
    });
  }
}
