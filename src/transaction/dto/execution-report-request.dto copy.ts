import { ProviderCode } from '@prisma/client';
export class CreateReportRequest {
  providerCode: ProviderCode;
  payToken: string;
  startLog: any;
  startTrace: string;
  transactionId: string;
}

export class UpdateReportRequest {
  endLog: any;
  endTrace: string;
}
