import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exiptions/http-filters.global';
import { SeedService } from './seeds/seed.service';
import * as express from 'express';

const PORT = process.env.PORT!;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Webhook uchun maxsus middleware - faqat webhook endpoint uchun raw body
  app.use(
    '/api/v1/payments/webhook',
    express.raw({ type: 'application/json' }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.enableCors({
    origin: '*',
  });
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  const seedService = app.get(SeedService);
  await seedService.runSeeds();

  await app.listen(PORT, () => console.log('Server runinig on port: ', PORT));
}
bootstrap();
