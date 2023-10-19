import { FinanceRequest, FinanceResponse } from 'src/momo/momo';

export interface CashInProvider {
  deposit(financeRequest: FinanceRequest): Promise<FinanceResponse>;

  depositWithCallback(): boolean;
}
