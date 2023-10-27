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
import { UserModule } from './user/user.module';
import { OperationModule } from './operation/operation.module';
import { CurrencyModule } from './currency/currency.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigurationModule } from './configuration/configuration.module';
import { ControlModule } from './control/control.module';
import { CallbackModule } from './callback/callback.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ApiClientModule,
    PaymentProviderModule,
    CurrencyModule,
    OperationModule,
    TransactionModule,
    IntouchModule,
    MomoModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    ConfigurationModule,
    ControlModule,
    CallbackModule,
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
