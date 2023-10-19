import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionRequest } from './dto/create-transaction.dto';
import { UpdateTransactionRequest } from './dto/update-transaction.dto';
import { PhoneHelperService } from '@app/phone-helper';
import { catchError, from } from 'rxjs';
import { PrismaService } from '@app/common/prisma';
import { ConnectionErrorException } from '@app/common';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private phoneHelper: PhoneHelperService,
  ) {}

  test(country: string) {
    const helper = this.phoneHelper.load(country);
    console.log('helper', helper);
    const formatedNumber = helper.getProviderCodeByMsisdn('23795839599');
    return formatedNumber;
  }

  create(request: CreateTransactionRequest) {
    return from(this.prisma.transaction.create({ data: request })).pipe(
      catchError((error) => {
        console.error(error);
        throw new ConnectionErrorException();
      }),
    );
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: string) {
    return from(
      this.prisma.transaction.findFirstOrThrow({ where: { id: id } }),
    ).pipe(
      catchError((error) => {
        console.error(error);
        if (error.code && error.code === 'P2025')
          throw new NotFoundException('Transation not found');
        throw new ConnectionErrorException();
      }),
    );
  }

  update(id: number, updateRequest: UpdateTransactionRequest) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
