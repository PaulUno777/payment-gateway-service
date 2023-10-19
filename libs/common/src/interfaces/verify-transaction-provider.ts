import { StatusResponse, StatusRequest } from 'src/momo/momo';

export interface VerifyTransactionService {
  getStatus(StatusRequest: StatusRequest): Promise<StatusResponse>;
}
