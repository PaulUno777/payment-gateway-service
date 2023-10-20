import {
  Amount,
  RecipientDetails,
  SenderDetails,
  Source,
} from '@app/common/types';
import { Mouvement, OperatorCode, ProviderCode } from '@prisma/client';

export class TransactionRequest {
  source: Source;

  senderDetails: SenderDetails;

  recipientDetails: RecipientDetails;

  amount: Amount;

  operatorCode: OperatorCode;

  callbackUrl?: string;

  description: string;

  mouvement: Mouvement;

  providerCode: ProviderCode;
}
