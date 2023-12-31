import { Body, Controller, Post, Get } from '@nestjs/common';
import { MomoService } from './momo.service';
import {
  FinanceResponse,
  PaymentServiceController,
  StatusResponse,
  UserInfosResponse,
} from './momo';

import { Observable } from 'rxjs';
import { FinanceRequest } from './dto/finance-request';
import { StatusRequest } from './dto/status-request';
import { UserInfosRequest } from './dto/user-infos-request';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from '@app/common';

@ApiTags('Momo Service for test purpose only')
@Controller('momo')
export class MomoController implements PaymentServiceController {
  constructor(private readonly momoService: MomoService) {}

  @IsPublic()
  @Get('/getCodes')
  getCodes(): Observable<string[]> | Promise<string[]> {
    return this.momoService.getProviderInfo();
  }

  @IsPublic()
  @Post('/cashin')
  cashIn(
    @Body()
    request: FinanceRequest,
  ): Observable<FinanceResponse> | Promise<FinanceResponse> {
    return this.momoService.cashIn(request);
  }

  @IsPublic()
  @Post('/cashout')
  cashOut(
    @Body()
    request: FinanceRequest,
  ): Observable<FinanceResponse> | Promise<FinanceResponse> {
    return this.momoService.cashOut(request);
  }

  @IsPublic()
  @Post('/transaction/status')
  checkTransactionStatus(
    @Body()
    request: StatusRequest,
  ): StatusResponse | Observable<StatusResponse> | Promise<StatusResponse> {
    return this.momoService.checkTransactionStatus(request);
  }

  @IsPublic()
  @Post('/user/infos')
  checkUserInfos(
    @Body()
    request: UserInfosRequest,
  ): Observable<UserInfosResponse> | Promise<UserInfosResponse> {
    return this.momoService.checkUserInfos(request);
  }
}
