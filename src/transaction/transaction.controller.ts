import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionRequest } from './dto/create-transaction.dto';
import { UpdateTransactionRequest } from './dto/update-transaction.dto';
import { IsPublic } from '@app/common';
import { ApiTags } from '@nestjs/swagger';

@IsPublic()
@ApiTags('Transactions')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createRequest: CreateTransactionRequest) {
    return this.transactionService.create(createRequest);
  }

  @Get()
  findAll() {
    return this.transactionService.test('CM');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRequest: UpdateTransactionRequest,
  ) {
    return this.transactionService.update(+id, updateRequest);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
