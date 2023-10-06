import { Injectable } from '@nestjs/common';
import { CreateTransactionRequest } from './dto/create-transaction.dto';
import { UpdateTransactionRequest } from './dto/update-transaction.dto';
import { PhoneHelperService } from '@app/phone-helper';

@Injectable()
export class TransactionService {
  constructor(private phoneHelper: PhoneHelperService) {}

  test(country: string) {
    const helper = this.phoneHelper.load(country);
    console.log('helper', helper);
    const formatedNumber = helper.getProviderCodeByMsisdn('23795839599');
    return formatedNumber;
  }

  create(createRequest: CreateTransactionRequest) {
    return 'This action adds a new transaction';
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateRequest: UpdateTransactionRequest) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
