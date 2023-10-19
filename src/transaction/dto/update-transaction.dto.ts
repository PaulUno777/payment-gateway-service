import { State } from '@prisma/client';
import { ExecutionReport } from '../../../libs/common/src/types/transaction.type.dto';

export class UpdateTransactionRequest {
  fees?: number;

  callbackUrl?: string;

  payToken?: string;

  state?: State;

  report?: ExecutionReport;
}
