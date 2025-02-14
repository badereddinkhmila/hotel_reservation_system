import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './utils/filters/response/response.interceptor';
import { ExceptionInterceptor } from './utils/filters/exception/exception.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [configService.get<string>('nats.uri')],
      user: configService.get<string>('nats.username'),
      pass: configService.get<string>('nats.password'),
    },
  });
  app.setGlobalPrefix('api/v1', {
    //exclude: [{ path: 'health', method: RequestMethod.GET }],
    //{ exclude: ['cats'] }
  });
  app.useGlobalPipes(
    new ValidationPipe({
      // retire tout les champs qui ne sont pas déclaré dans la dto
      whitelist: true,
      // rejette les requêtes qui contiennent des champs non déclaré dans la dto
      forbidNonWhitelisted: true,
    }),
  );
  // app.useGlobalInterceptors(
  //   new ClassSerializerInterceptor(app.get(Reflector), {
  //     strategy: 'excludeAll',
  //     excludeExtraneousValues: true,
  //   }),
  // );
  // Global interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global exception filter
  app.useGlobalFilters(new ExceptionInterceptor());
  app.enableCors({ origin: '*' });

  await app.startAllMicroservices();
  await app.listen(process.env.APP_PORT ?? 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
