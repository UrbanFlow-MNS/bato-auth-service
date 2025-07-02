import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_MQ ?? ""],
      queue: 'auth_queue',
      queueOptions: { durable: false },
    },
  });

  await app.listen();
}

bootstrap();
