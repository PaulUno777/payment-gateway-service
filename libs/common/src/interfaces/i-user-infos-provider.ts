import { Observable } from 'rxjs';
import { UserInfosRequest, UserInfosResponse } from 'src/momo/momo';

export interface UserInfosProvider {
  checkUserInfos(
    request: UserInfosRequest,
  ): Promise<UserInfosResponse> | Observable<UserInfosResponse>;
}
