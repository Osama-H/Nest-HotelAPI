import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
// import * as csurf from 'csurf';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.use(helmet());
  // app.use(csurf());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  await app.listen(port);
  logger.log(`Application running on port ${port}`);
}
bootstrap();
