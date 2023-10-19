import { Mouvement, OperatorCode, ProviderCode } from '@prisma/client';
import {
  Amount,
  RecipientDetails,
  SenderDetails,
  Source,
} from '../../../libs/common/src/types/transaction.type.dto';

export class CreateTransactionRequest {
  source: Source;

  senderDetails: SenderDetails;

  recipientDetails: RecipientDetails;

  amount: Amount;

  operatorCode: OperatorCode;

  callbackUrl?: string;

  payToken?: string;

  description: string;

  mouvement: Mouvement;

  providerCode: ProviderCode;
}
