import { Observable } from 'rxjs';
import { FinanceRequest, FinanceResponse } from 'src/momo/momo';

export interface CashInProvider {
  cashIn(
    financeRequest: FinanceRequest,
  ): Promise<FinanceResponse> | Observable<FinanceResponse>;
}
