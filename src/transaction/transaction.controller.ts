import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { IsPublic } from '@app/common';
import { ApiTags } from '@nestjs/swagger';
import { AllTransactionRequest } from './dto/all-transaction-request.dto';

@IsPublic()
@ApiTags('Transactions')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('all-paginated')
  allPaginated(@Body() request: AllTransactionRequest) {
    return this.transactionService.allPaginated(request);
  }

  @Get()
  findAll() {
    return this.transactionService.test('CM');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }
}
