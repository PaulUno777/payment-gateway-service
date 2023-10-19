import { Observable } from 'rxjs';
import { Amount, VoidNoParam } from 'src/intouch/intouch';

export interface AccountBalanceProvider {
  getAccountBalance(request: VoidNoParam): Promise<Amount> | Observable<Amount>;
}
