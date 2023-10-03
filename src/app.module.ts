import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@app/common/prisma';
import { APP_GUARD } from '@nestjs/core';
import { ApiClientModule } from './api-client/api-client.module';
import { IntouchModule } from './intouch/intouch.module';
import { MomoModule } from './momo/momo.module';
import { PaymentProviderModule } from './payment-provider/payment-provider.module';
import { TransactionModule } from './transaction/transaction.module';
import { AuthTokenGard, HasRoleGuard, LoggerMiddleware } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ApiClientModule,
    IntouchModule,
    MomoModule,
    PaymentProviderModule,
    TransactionModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthTokenGard,
    },
    {
      provide: APP_GUARD,
      useClass: HasRoleGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
