import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

export function Serilizer<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializerInterceptor(dto));
}

export class SerializerInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(map((data) => plainToClass(this.dto, data)));
  }
}
