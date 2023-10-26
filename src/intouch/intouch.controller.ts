import { Controller, Get, Post, Body } from '@nestjs/common';
import { IntouchService } from './intouch.service';
import {
  AccountBalanceResponse,
  FinanceRequest,
  FinanceResponse,
  PaymentServiceController,
  StatusRequest,
  StatusResponse,
} from './intouch';
import { Observable } from 'rxjs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HasRole, IsPublic } from '@app/common';
import { RoleType } from 'src/auth/types/role-type';

@IsPublic()
@ApiTags('Intouch for test purpose only')
@Controller('intouch')
export class IntouchController implements PaymentServiceController {
  constructor(private readonly intouchService: IntouchService) {}

  @Get('account/balance')
  getAccountBalance():
    | Observable<AccountBalanceResponse>
    | Promise<AccountBalanceResponse> {
    return this.intouchService.getAccountBalance({});
  }

  @Post('transaction/status')
  checkTransactionStatus(
    @Body() request: StatusRequest,
  ): Observable<StatusResponse> | Promise<StatusResponse> {
    return this.intouchService.checkTransactionStatus(request);
  }

  @Post('transaction/cashin')
  cashIn(
    @Body() request: FinanceRequest,
  ): Observable<FinanceResponse> | Promise<FinanceResponse> {
    return this.intouchService.cashIn(request);
  }
}
