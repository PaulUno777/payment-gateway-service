import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { OperationService } from './operation.service';
import { OperationRequest } from './dto/operation-request';
import { CurrentUser, HasRole } from '@app/common';
import { RoleType } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { OperationResponse, UserInfo } from './dto/operation-response.dto';
import { Observable } from 'rxjs';

@HasRole(
  RoleType.super_admin,
  RoleType.manage_users,
  RoleType.all,
  RoleType.api_client,
)
@ApiTags('Operations')
@Controller('operation')
export class OperationController {
  constructor(private readonly operationService: OperationService) {}

  @ApiBearerAuth('jwt-auth')
  @ApiCreatedResponse({
    description: 'Returns authentification tokens',
    type: OperationResponse,
  })
  @ApiOperation({ summary: 'make a payment' })
  @Post('cash-in')
  cashin(@CurrentUser() source, @Body() operationRequest: OperationRequest) {
    return this.operationService.cashin(source, operationRequest);
  }

  @ApiBearerAuth('jwt-auth')
  @ApiCreatedResponse({
    description: 'Returns Transaction',
    type: OperationResponse,
  })
  @ApiOperation({ summary: 'Make a disbursement' })
  @Post('cash-out')
  cashout(@CurrentUser() source, @Body() operationRequest: OperationRequest) {
    return this.operationService.cashout(source, operationRequest);
  }

  @ApiBearerAuth('jwt-auth')
  @ApiOkResponse({
    description: 'Returns Transaction',
    type: OperationResponse,
  })
  @ApiOperation({ summary: 'Get transaction status' })
  @Get('payment-status/:id')
  getStatus(@Param('id') id: string) {
    return this.operationService.getStatus(id);
  }

  @ApiBearerAuth('jwt-auth')
  @ApiOkResponse({
    description: 'Returns user informations',
    type: UserInfo,
  })
  @ApiOperation({ summary: "Retrieve the subscriber's name from their Msisdn" })
  @Get('subscriber-info/:countryAlpha2/:msisdn')
  getSubscriberInfos(
    @Param('countryAlpha2') country: string,
    @Param('msisdn') msisdn: string,
  ): Observable<UserInfo> {
    if (country.length != 2 || /\D/.test(msisdn))
      throw new BadRequestException('make sure your parameters are valid');
    return this.operationService.getSubscriberInfos(country, msisdn);
  }
}
