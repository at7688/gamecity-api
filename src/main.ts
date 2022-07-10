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
      'https://localhost:8809',
      'https://dev.gamecity-admin.techcake.net',
      'https://gamecity-admin.techcake.net',
      'https://gamecity-agent.techcake.net',
      'https://dev.gamecity-agent.techcake.net',
      'https://gamecity-client.techcake.net',
      'https://dev.gamecity-client.techcake.net',
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
