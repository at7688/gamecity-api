import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

const port = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:8809',
      'http://dev.gamecity-admin.techcake.net',
      'http://gamecity-admin.techcake.net',
      'http://gamecity-agent.techcake.net',
      'http://dev.gamecity-agent.techcake.net',
      'http://gamecity-client.techcake.net',
      'http://dev.gamecity-client.techcake.net',
    ],
    credentials: true,
  });
  app.use(helmet());
  app.use(
    session({
      secret: 'happyhour',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Game City')
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
