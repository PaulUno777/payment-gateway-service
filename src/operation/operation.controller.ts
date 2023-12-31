import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { OperationService } from './operation.service';
import { OperationRequest, ProcessRequest } from './dto/operation-request';
import { CurrentUser, HasRole } from '@app/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { OperationResponse, UserInfo } from './dto/operation-response.dto';
import { Observable } from 'rxjs';
import { RoleType } from 'src/auth/types/role-type';
import { ProviderType } from '@prisma/client';

@ApiBearerAuth('jwt-auth')
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

  @ApiCreatedResponse({
    description: 'Returns authentification tokens',
    type: OperationResponse,
  })
  @ApiOperation({ summary: 'Initiate a disbursement' })
  @Post('cashin')
  cashin(@CurrentUser() source, @Body() operationRequest: OperationRequest) {
    return this.operationService.cashin(source, operationRequest);
  }

  @ApiCreatedResponse({
    description: 'Returns Transaction',
    type: OperationResponse,
  })
  @ApiOperation({ summary: 'Initiate a collection' })
  @Post('cashout')
  cashout(@CurrentUser() source, @Body() operationRequest: OperationRequest) {
    return this.operationService.cashout(source, operationRequest);
  }

  @ApiOkResponse({
    description: 'Process a transaction at the created or failed stage',
    type: OperationResponse,
  })
  @ApiOperation({
    summary: 'Process created or failed transaction',
  })
  @Post('process')
  processTransaction(@Body() processRequest: ProcessRequest) {
    return this.operationService.processTransaction(processRequest);
  }

  @ApiOkResponse({
    description: 'Returns Transaction',
    type: OperationResponse,
  })
  @ApiOperation({ summary: 'Get transaction status' })
  @Get('status/:id')
  checkPaymentStatus(@Param('id') id: string) {
    return this.operationService.checkPaymentStatus(id);
  }

  @ApiOkResponse({
    description: 'Returns user informations',
    type: UserInfo,
  })
  @ApiOperation({ summary: "Retrieve the subscriber's name from their Msisdn" })
  @Get('subscriber/info/:countryIsoAlpha2/:partyIdType/:partyId')
  getSubscriberInfos(
    @Param('countryIsoAlpha2') country: string,
    @Param('partyIdType') partyIdType: string,
    @Param('partyId') partyId: string,
  ): Observable<UserInfo> {
    if (!Object.keys(ProviderType).includes(partyIdType))
      throw new BadRequestException(
        `Available partyIdType are ${Object.keys(ProviderType)}`,
      );
    if (country.length != 2 || /\D/.test(partyId))
      throw new BadRequestException('Make sure your parameters are valid');
    return this.operationService.getSubscriberInfos(
      country,
      partyIdType,
      partyId,
    );
  }
}
