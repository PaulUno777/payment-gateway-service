import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentProviderService } from './payment-provider.service';
import { CreatePaymentProviderRequest } from './dto/create-payment-provider.dto';
import { UpdatePaymentProviderRequest } from './dto/update-payment-provider.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleType } from '@prisma/client';
import { HasRole } from '@app/common';

@HasRole(RoleType.super_admin, RoleType.manage_users, RoleType.all)
@ApiTags('Payment Provider')
@Controller('payment-provider')
export class PaymentProviderController {
  constructor(
    private readonly paymentProviderService: PaymentProviderService,
  ) {}

  @ApiBearerAuth('jwt-auth')
  @HttpCode(HttpStatus.OK)
  @Post()
  create(@Body() createRequest: CreatePaymentProviderRequest) {
    return this.paymentProviderService.create(createRequest);
  }

  @ApiBearerAuth('jwt-auth')
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.paymentProviderService.findAll();
  }

  @ApiBearerAuth('jwt-auth')
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentProviderService.findOne(id);
  }

  @ApiBearerAuth('jwt-auth')
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRequest: UpdatePaymentProviderRequest,
  ) {
    return this.paymentProviderService.update(id, updateRequest);
  }

  @ApiBearerAuth('jwt-auth')
  @HttpCode(HttpStatus.OK)
  @Patch(':id/toggle-activation')
  toggleActivation(@Param('id') id: string) {
    return this.paymentProviderService.toggleActivation(id);
  }

  @ApiBearerAuth('jwt-auth')
  @HttpCode(HttpStatus.OK)
  @Get('provider/code')
  findAllProviderCode() {
    return this.paymentProviderService.findAllProviderCode();
  }

  @ApiBearerAuth('jwt-auth')
  @HttpCode(HttpStatus.OK)
  @Post('test')
  test(@Body() body) {
    console.log('body.amount', body.amount);
    return this.paymentProviderService.findSuitableProvider(body.amount);
  }
}
