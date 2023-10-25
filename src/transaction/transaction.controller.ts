import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { IsPublic } from '@app/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateTransactionRequest,
  PeageableTransactionRequest,
} from './dto/transaction-request.dto';

@IsPublic()
@ApiTags('Transactions')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() request: CreateTransactionRequest) {
    return this.transactionService.create(request);
  }

  @Post('all-paginated')
  allPaginated(@Body() request: PeageableTransactionRequest) {
    return this.transactionService.allPaginated();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }
}
