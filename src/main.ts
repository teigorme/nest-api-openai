import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { patchNestjsSwagger } from '@anatine/zod-nestjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('API NestJS🐈')
    .setDescription('Docs gerada automaticatimente para a API')
    .setVersion('1.0.0')
    .build();

  patchNestjsSwagger();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3333;

  await app.listen(port, () => {
    Logger.log('🚀Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}
bootstrap();