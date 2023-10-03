import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { PaymentProviderService } from './payment-provider.service';
import { CreatePaymentProviderRequest } from './dto/create-payment-provider.dto';
import { UpdatePaymentProviderRequest } from './dto/update-payment-provider.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleType } from '@prisma/client';
import { HasRole, IsPublic } from '@app/common';

@ApiTags('Payment Provider')
@Controller('payment-provider')
export class PaymentProviderController {
  constructor(
    private readonly paymentProviderService: PaymentProviderService,
  ) {}

  @ApiBearerAuth('jwt-auth')
  @HasRole(RoleType.super_admin, RoleType.manage_users)
  @Post()
  create(@Body() createRequest: CreatePaymentProviderRequest) {
    return this.paymentProviderService.create(createRequest);
  }

  @IsPublic()
  @Get()
  findAll() {
    return this.paymentProviderService.findAll();
  }

  @IsPublic()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentProviderService.findOne(id);
  }

  @IsPublic()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRequest: UpdatePaymentProviderRequest,
  ) {
    return this.paymentProviderService.update(id, updateRequest);
  }

  @IsPublic()
  @Patch(':id/toggle-activation')
  toggleActivation(@Param('id') id: string) {
    return this.paymentProviderService.toggleActivation(id);
  }
}
