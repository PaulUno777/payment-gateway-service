import { Module } from '@nestjs/common';
import { MomoService } from './momo.service';
import { MomoController } from './momo.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MOMO_PACKAGE_PACKAGE_NAME } from './momo';
import { join } from 'path';
import { MOMO_PACKAGE_NAME } from '@app/common/constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MOMO_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.MOMO_GRPC_URL,
          package: MOMO_PACKAGE_PACKAGE_NAME,
          protoPath: join(__dirname, './momo.proto'),
        },
      },
    ]),
  ],
  controllers: [MomoController],
  providers: [MomoService],
  exports: [MomoService],
})
export class MomoModule {}
