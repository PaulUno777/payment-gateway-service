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
import { UpdateTransactionRequest } from './dto/update-transaction.dto';
import { IsPublic } from '@app/common';
import { ApiTags } from '@nestjs/swagger';
import { AllTransactionRequest } from './dto/transaction-request.dto';

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
