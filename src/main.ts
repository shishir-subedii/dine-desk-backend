import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //Remove console logs on production
  const isProd = process.env.APP_ENV?.trim() === 'production';

  if (isProd) {
    Logger.overrideLogger(false);
    console.log = () => { };
    console.warn = () => { };
    console.error = () => { };
    console.debug = () => { };
  }
  app.enableCors({
    origin: '*'
  })

  // serve static files from uploads
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,      // Strip unknown props
      forbidNonWhitelisted: false, // it was previously true
      transform: true,      // auto-transform to DTO types
    }),
  );

  // Global Interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global Error Handler
  app.useGlobalFilters(new GlobalExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('Docs for DineDesk application')
    .setDescription('API documentation for DineDesk application. DineDesk is a multi vendor restaurant management system')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
