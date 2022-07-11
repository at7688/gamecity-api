import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import * as fs from 'fs';
const port = process.env.PORT || 8080;

async function bootstrap() {
  const httpsOptions: HttpsOptions = {
    key: fs.readFileSync('./secrets/localhost-key.pem'),
    cert: fs.readFileSync('./secrets/localhost.pem'),
    honorCipherOrder: true,
    // requestCert: true,
  };
  const app = await NestFactory.create(AppModule, {
    httpsOptions:
      process.env.NODE_ENV === 'development'
        ? httpsOptions
        : {
            honorCipherOrder: true,
            // requestCert: true,
          },
  });

  app.enableCors({
    origin: [/\.techcake\.net/, /localhost/],
    credentials: true,
    // methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTION'],
    // exposedHeaders: ['Set-Cookie'],
    // allowedHeaders: ['Set-Cookie'],
  });
  app.use(helmet());
  app.use(
    session({
      secret: 'happyhour',
      resave: false,
      saveUninitialized: false,
      cookie: {
        sameSite: 'none',
        secure: true,
        // domain: '.techcake.net',
        maxAge: 1000 * 60 * 60, // 1小時
        // path: '/',
        httpOnly: true,
      },
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
