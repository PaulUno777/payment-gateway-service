import { Module } from '@nestjs/common';
import { IntouchService } from './intouch.service';
import { IntouchController } from './intouch.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { INTOUCH_PACKAGE_PACKAGE_NAME } from '@app/common/constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'INTOUCH_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50000',
          package: INTOUCH_PACKAGE_PACKAGE_NAME,
          protoPath: join(__dirname, './intouch.proto'),
        },
      },
    ]),
  ],
  controllers: [IntouchController],
  providers: [IntouchService],
})
export class IntouchModule {}
