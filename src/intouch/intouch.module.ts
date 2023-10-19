import { Module } from '@nestjs/common';
import { IntouchService } from './intouch.service';
import { IntouchController } from './intouch.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { INTOUCH_PACKAGE_PACKAGE_NAME } from './intouch';
import { INTOUCH_PACKAGE_NAME } from '@app/common/constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: INTOUCH_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.INTOUCH_GRPC_URL,
          package: INTOUCH_PACKAGE_PACKAGE_NAME,
          protoPath: join(__dirname, './intouch.proto'),
        },
      },
    ]),
  ],
  controllers: [IntouchController],
  providers: [IntouchService],
  exports: [IntouchService],
})
export class IntouchModule {}
