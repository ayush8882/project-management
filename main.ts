import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config'
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted:true
  }))

  const port = process.env.PORT ?? 3000

  await app.listen(port);
  console.log('Server started at PORT: ' , port)
}
bootstrap();
