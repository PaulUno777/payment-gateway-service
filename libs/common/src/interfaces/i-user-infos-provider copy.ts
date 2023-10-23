import { Observable } from 'rxjs';
import { Amount, Empty } from 'src/intouch/intouch';

export interface AccountBalanceProvider {
  getAccountBalance(request: Empty): Promise<Amount> | Observable<Amount>;
}
