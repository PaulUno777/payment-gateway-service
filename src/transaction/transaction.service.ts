import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTransactionRequest } from './dto/update-transaction.dto';
import { PhoneHelperService } from '@app/phone-helper';
import { catchError, from } from 'rxjs';
import { PrismaService } from '@app/common/prisma';
import { ConnectionErrorException } from '@app/common';
import { AllTransactionRequest } from './dto/all-transaction-request.dto';
import { CreateTransactionRequest } from './dto/create-transaction-request.dto';

@Injectable()
export class TransactionService {
  allPaginated(request: AllTransactionRequest) {
    throw new Error('Method not implemented.');
  }
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

  update(id: string, updateRequest: UpdateTransactionRequest) {
    return from(
      this.prisma.transaction.update({
        where: { id: id },
        data: updateRequest,
      }),
    ).pipe(
      catchError((error) => {
        console.error(error);
        throw new ConnectionErrorException();
      }),
    );
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
