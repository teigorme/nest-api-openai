import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000',
  });

  const config = new DocumentBuilder()
    .setTitle('API NestJS 🚀')
    .setDescription('Docs gerada automaticatimente para a API')
    .setVersion('1.0.0')
    .build();

  patchNestjsSwagger();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const port = Number(process.env.PORT) || 3333;

  await app.listen(port, () => {
    Logger.log(
      '\n🚀 Application is running!\n' +
        `🌐 URL: http://localhost:${port}/${globalPrefix}\n` +
        `📅 Started at: ${new Date().toLocaleString()}`,
      'Bootstrap',
    );
  });
}

bootstrap();
