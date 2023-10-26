import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { IsPublic } from '@app/common';
import { ApiTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { PageableTransaction } from './dto/transaction-request.dto';

@IsPublic()
@ApiTags('Transactions')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOkResponse({
    description: 'Returns paginated Transactions',
  })
  @ApiOperation({ summary: 'Find all transactions paginated' })
  @Post('paginated')
  findAllPaginated(@Body() request: PageableTransaction) {
    return this.transactionService.findAllPaginated(request);
  }

  @ApiOkResponse({
    description: 'Returns a Transaction and his execution report',
  })
  @ApiOperation({ summary: 'Find one transaction based on id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }
}
