import {
  BadRequestException,
  ValidationPipe,
  VersioningType,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as requestIp from 'request-ip';
import { AppModule } from './app.module';
import { ResCode } from './errors/enums';
const port = process.env.PORT || 80;

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
        console.log(errors);
        let msg = '格式錯誤';
        try {
          msg = errors.map((t) => Object.values(t.constraints)).flat()[0];
        } catch (err) {
          //
        }
        throw new BadRequestException({
          code: ResCode.FORMAT_ERR,
          msg,
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
