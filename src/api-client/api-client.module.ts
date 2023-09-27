import { Module } from '@nestjs/common';
import { ApiClientService } from './api-client.service';
import { ApiClientController } from './api-client.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [ApiClientController],
  providers: [ApiClientService],
  exports: [ApiClientService],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
    }),
  ],
})
export class ApiClientModule {}
