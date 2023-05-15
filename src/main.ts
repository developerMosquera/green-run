import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const appService = app.get(AppService);
  await appService.setup(app);
}

bootstrap();
