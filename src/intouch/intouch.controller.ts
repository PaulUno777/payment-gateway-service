import { Controller, Get, Post, Body } from '@nestjs/common';
import { IntouchService } from './intouch.service';
import {
  Amount,
  FinanceRequest,
  FinanceResponse,
  PaymentController,
  StatusRequest,
  StatusResponse,
} from './intouch';
import { Observable } from 'rxjs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HasRole } from '@app/common';
import { RoleType } from '@prisma/client';

@ApiTags('Intouch')
@Controller('intouch')
export class IntouchController implements PaymentController {
  constructor(private readonly intouchService: IntouchService) {}

  @ApiBearerAuth('jwt-auth')
  @HasRole(RoleType.super_admin, RoleType.manage_users, RoleType.client_manager)
  @Get('account/balance')
  getAccountBalance(): Observable<Amount> | Promise<Amount> {
    return this.intouchService.getAccountBalance({});
  }

  @ApiBearerAuth('jwt-auth')
  @HasRole(RoleType.super_admin, RoleType.manage_users, RoleType.client_manager)
  @Post('transaction/status')
  checkTransactionStatus(
    @Body() request: StatusRequest,
  ): Observable<StatusResponse> | Promise<StatusResponse> {
    return this.intouchService.checkTransactionStatus(request);
  }

  @ApiBearerAuth('jwt-auth')
  @HasRole(RoleType.super_admin, RoleType.manage_users, RoleType.client_manager)
  @Post('transaction/cash-in')
  cashIn(
    @Body() request: FinanceRequest,
  ): Observable<FinanceResponse> | Promise<FinanceResponse> {
    return this.intouchService.cashIn(request);
  }
}
