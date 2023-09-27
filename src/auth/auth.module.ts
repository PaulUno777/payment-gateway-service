import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthTokenStrategy } from './strategies/auth-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { PassportModule } from '@nestjs/passport';
import { HttpAuthStrategy } from './strategies/http.auth.strategy';
import { ApiClientModule } from 'src/api-client/api-client.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
    }),
    ApiClientModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthTokenStrategy,
    RefreshTokenStrategy,
    HttpAuthStrategy,
  ],
})
export class AuthModule {}
