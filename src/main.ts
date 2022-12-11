import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors(
    {
      origin: '*'
    }
  );
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(5000, () => {
    console.log(`server is up and running on port ${5000}`)
  });
}
bootstrap();
