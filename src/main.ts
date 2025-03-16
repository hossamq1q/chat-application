import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { WebsocketAdapter } from './gateway/gateway.adapter';

async function bootstrap() {
  const { PORT } = process.env;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  const dataSource = app.get<DataSource>(DataSource);
  const adapter = new WebsocketAdapter(app,dataSource);
  app.useWebSocketAdapter(adapter);

  app.enableCors({
    origin: '*',
    credentials: true,
  });
  try {
    await app.listen(PORT, () =>
      console.log('server is running on port ' + PORT),
    );
  } catch (error) {
    console.log(error);
  }
}

bootstrap();
