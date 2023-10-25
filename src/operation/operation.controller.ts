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
import { PartyIdType } from '@prisma/client';

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
  @ApiOperation({ summary: 'make a payment' })
  @Post('cash-in')
  cashin(@CurrentUser() source, @Body() operationRequest: OperationRequest) {
    return this.operationService.cashin(source, operationRequest);
  }

  // @ApiCreatedResponse({
  //   description: 'Returns Transaction',
  //   type: OperationResponse,
  // })
  // @ApiOperation({ summary: 'Make a disbursement' })
  // @Post('cash-out')
  // cashout(@CurrentUser() source, @Body() operationRequest: OperationRequest) {
  //   return this.operationService.cashout(source, operationRequest);
  // }

  // @ApiOkResponse({
  //   description: 'Returns Transaction',
  //   type: OperationResponse,
  // })
  // @ApiOperation({ summary: 'Get transaction status' })
  // @Get('payment-status/:id')
  // getStatus(@Param('id') id: string) {
  //   return this.operationService.getStatus(id);
  // }

  @ApiOkResponse({
    description: 'Returns user informations',
    type: UserInfo,
  })
  @ApiOperation({ summary: "Retrieve the subscriber's name from their Msisdn" })
  @Get('subscriber-info/:countryIsoAlpha2/:partyIdType/:partyId')
  getSubscriberInfos(
    @Param('countryIsoAlpha2') country: string,
    @Param('partyIdType') partyIdType: string,
    @Param('partyId') partyId: string,
  ): Observable<UserInfo> {
    if (!Object.keys(PartyIdType).includes(partyIdType))
      throw new BadRequestException(
        `Available partyIdType are ${Object.keys(PartyIdType)}`,
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
