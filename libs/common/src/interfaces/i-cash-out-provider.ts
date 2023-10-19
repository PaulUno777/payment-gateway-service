import { Observable } from 'rxjs';
import { FinanceRequest, FinanceResponse } from 'src/momo/momo';

export interface CashOutProvider {
  cashOut(
    financeRequest: FinanceRequest,
  ): Promise<FinanceResponse> | Observable<FinanceResponse>;
}
