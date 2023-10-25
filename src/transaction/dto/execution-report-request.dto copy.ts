export class CreateReportRequest {
  startLog: any;
  startTrace: string;
  transactionId: string;
}

export class UpdateReportRequest {
  endLog: any;
  endTrace: string;
}
