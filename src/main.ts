import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  //configure validation pipeline
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  //authentication guards

  //API Documentation.
  const config = new DocumentBuilder()
    .setTitle('KAMIX Payment Service Documentation')
    .setDescription('Payment Service powered by KAMIX')
    .setVersion('0.3')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'jwt-auth',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'jwt-refresh',
    )
    .addBasicAuth({
      type: 'http',
      scheme: 'basic',
      description: 'Enter Basic Auth credentials',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //Manage CORS
  app.enableCors();

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}/api`);
  });
}

bootstrap();
