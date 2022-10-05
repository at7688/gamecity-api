import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResCode } from 'src/errors/enums';

interface ErrorResBase {
  code: string;
  msg: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const res = exception.getResponse() as ErrorResBase;

    if ([HttpStatus.FORBIDDEN, HttpStatus.UNAUTHORIZED].includes(status)) {
      console.log(res);
      response.status(status).json({
        code: ResCode.NO_AUTH,
        msg: res?.msg || 'Unauthorized',
      });
    } else if (status === HttpStatus.BAD_REQUEST) {
      response.status(status).json(res);
    } else {
      response.status(status).json({
        code: ResCode.EXCEPTION_ERR,
        msg: 'Exception Error',
      });
    }
  }
}
