import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  Empty,
  PROVIDER_SERVICE_NAME,
  ProviderInfoResponse,
  ProviderServiceClient,
} from './momo';
import { Observable } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { MOMO_PACKAGE_NAME } from '@app/common/constants';

@Injectable()
export class InfoMomoService implements OnModuleInit, ProviderServiceClient {
  private ProviderService: ProviderServiceClient;
  constructor(@Inject(MOMO_PACKAGE_NAME) private client: ClientGrpc) {}
  onModuleInit() {
    this.ProviderService = this.client.getService<ProviderServiceClient>(
      PROVIDER_SERVICE_NAME,
    );
  }
  getProviderInfo(request: Empty): Observable<ProviderInfoResponse> {
    return this.ProviderService.getProviderInfo(request);
  }
}
