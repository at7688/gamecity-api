import {
  BadRequestException,
  ValidationPipe,
  VersioningType,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as requestIp from 'request-ip';
import { ResCode } from './errors/enums';
import { take } from 'lodash';
const port = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(helmet());
  app.use(requestIp.mw({ attributeName: 'ip' }));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory(errors) {
        const msgs = errors.map((t) => Object.values(t.constraints)).flat();
        throw new BadRequestException({
          code: ResCode.FORMAT_ERR,
          msg: msgs?.[0] || '',
        });
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('ASG')
    .setDescription('...')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidoc', app, document);
  await app.listen(port, () => {
    console.log(`app is running on port ${port}!`);
  });
}
bootstrap();
