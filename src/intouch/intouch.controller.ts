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
import { HasRole } from '@app/common';
import { RoleType } from 'src/auth/types/role-type';

@HasRole(RoleType.super_admin, RoleType.manage_users, RoleType.client_manager)
@ApiTags('Intouch')
@Controller('intouch')
export class IntouchController implements PaymentServiceController {
  constructor(private readonly intouchService: IntouchService) {}

  @ApiBearerAuth('jwt-auth')
  @Get('account/balance')
  getAccountBalance():
    | Observable<AccountBalanceResponse>
    | Promise<AccountBalanceResponse> {
    return this.intouchService.getAccountBalance({});
  }

  @ApiBearerAuth('jwt-auth')
  @Post('transaction/status')
  checkTransactionStatus(
    @Body() request: StatusRequest,
  ): Observable<StatusResponse> | Promise<StatusResponse> {
    return this.intouchService.checkTransactionStatus(request);
  }

  @ApiBearerAuth('jwt-auth')
  @Post('transaction/cash-in')
  cashIn(
    @Body() request: FinanceRequest,
  ): Observable<FinanceResponse> | Promise<FinanceResponse> {
    return this.intouchService.cashIn(request);
  }
}
