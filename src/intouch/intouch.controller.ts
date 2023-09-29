import { Controller, Get, Post, Body } from '@nestjs/common';
import { IntouchService } from './intouch.service';
import {
  PaymentController,
  amount,
  cashInRes,
  transactionStatus,
} from './intouch';
import { Observable } from 'rxjs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HasRole } from '@app/common';
import { RoleType } from '@prisma/client';
import { transactionId } from './dto/transaction-id.dto';
import { cashInReq } from './dto/cashin-req';

@ApiTags('Intouch')
@Controller('intouch')
export class IntouchController implements PaymentController {
  constructor(private readonly intouchService: IntouchService) {}

  @ApiBearerAuth('jwt-auth')
  @HasRole(RoleType.super_admin, RoleType.manage_users, RoleType.client_manager)
  @Get('account/balance')
  getAccountBalance(): amount | Observable<amount> | Promise<amount> {
    return this.intouchService.getAccountBalance({});
  }

  @ApiBearerAuth('jwt-auth')
  @HasRole(RoleType.super_admin, RoleType.manage_users, RoleType.client_manager)
  @Post('transaction/status')
  checkTransactionStatus(
    @Body() request: transactionId,
  ):
    | transactionStatus
    | Observable<transactionStatus>
    | Promise<transactionStatus> {
    return this.intouchService.checkTransactionStatus(request);
  }

  @ApiBearerAuth('jwt-auth')
  @HasRole(RoleType.super_admin, RoleType.manage_users, RoleType.client_manager)
  @Post('transaction/cash-in')
  cashIn(
    @Body()
    request: cashInReq,
  ): cashInRes | Observable<cashInRes> | Promise<cashInRes> {
    return this.intouchService.cashIn(request);
  }
}
