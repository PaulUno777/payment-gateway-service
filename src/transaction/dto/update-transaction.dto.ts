import { Mouvement, State } from '@prisma/client';
import {
  Amount,
  RecipientDetails,
  SenderDetails,
  Source,
} from './transaction.type.dto';

export class UpdateTransactionRequest {
  source?: Source;

  senderDetails?: SenderDetails;

  recipientDetails?: RecipientDetails;

  amount?: Amount;

  PrividerCode?: string;

  fees?: number;

  description?: string;

  callbackUrl?: string;

  payToken?: string;

  state?: State;

  mouvement?: Mouvement;
}
