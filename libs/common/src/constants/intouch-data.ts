import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

const PROTO_PATH = join(__dirname, './intouch.proto');

export const intouchClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: 'localhost:5000',
    package: 'intouch',
    protoPath: PROTO_PATH,
  },
};
