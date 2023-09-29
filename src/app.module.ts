import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthTokenGard, LoggerMiddleware, PrismaModule } from '@app/common';
import { APP_GUARD } from '@nestjs/core';
import { ApiClientModule } from './api-client/api-client.module';
import { IntouchModule } from './intouch/intouch.module';
import { MomoModule } from './momo/momo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ApiClientModule,
    IntouchModule,
    MomoModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthTokenGard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
