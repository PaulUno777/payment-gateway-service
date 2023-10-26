import { Controller, Get, Query } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  ConvertCurrencyRequest,
  ConvertCurrencyResponse,
} from './dto/currency.dto';

@ApiBearerAuth('jwt-auth')
@ApiTags('Currency')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @ApiOkResponse({
    description: 'Convert currencies based on current exchange rate',
    type: ConvertCurrencyResponse,
  })
  @ApiOperation({ summary: 'recover all available currencies' })
  @ApiQuery({ name: 'amount', required: true })
  @ApiQuery({ name: 'to', required: true })
  @ApiQuery({ name: 'from', required: true })
  @Get('convert')
  convertCurrency(
    @Query() query: ConvertCurrencyRequest,
  ): ConvertCurrencyResponse {
    return this.currencyService.convertCurrency(query);
  }
}
