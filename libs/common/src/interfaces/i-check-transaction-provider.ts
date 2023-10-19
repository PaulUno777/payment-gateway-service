import { Observable } from 'rxjs';
import { StatusResponse, StatusRequest } from 'src/momo/momo';

export interface CheckTransactionStatus {
  checkTransactionStatus(
    StatusRequest: StatusRequest,
  ): Promise<StatusResponse> | Observable<StatusResponse>;
}
