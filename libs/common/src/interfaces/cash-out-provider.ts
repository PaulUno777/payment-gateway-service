import { FinanceRequest, FinanceResponse } from 'src/momo/momo';

export interface CashOutProvider {
  withdrawal(financeRequest: FinanceRequest): Promise<FinanceResponse>;

  withdrawalWithCallback(): boolean
}
