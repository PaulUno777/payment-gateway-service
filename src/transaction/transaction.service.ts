import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PhoneHelperService } from '@app/phone-helper';
import { Observable, catchError, from, map, switchMap } from 'rxjs';
import { PrismaService } from '@app/common/prisma';
import { ConnectionErrorException } from '@app/common';
import {
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from './dto/transaction-request.dto';
import { State, Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
  private logger = new Logger();
  allPaginated() {
    throw new Error('Method not implemented.');
  }
  constructor(
    private readonly prisma: PrismaService,
    private phoneHelper: PhoneHelperService,
  ) {}

  create(request: CreateTransactionRequest) {
    return from(this.prisma.transaction.create({ data: request })).pipe(
      catchError(() => {
        throw new ConnectionErrorException();
      }),
    );
  }

  findAll() {
    return from(this.prisma.transaction.findMany()).pipe(
      catchError(() => {
        throw new ConnectionErrorException();
      }),
    );
  }

  findOne(id: string) {
    return from(
      this.prisma.transaction.findFirstOrThrow({
        where: { id: id },
        include: { executionReports: true },
      }),
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
    return this.findOne(id).pipe(
      switchMap((transaction) => {
        return from(
          this.prisma.transaction.update({
            where: { id: transaction.id },
            data: updateRequest,
          }),
        );
      }),
      catchError((error) => {
        console.error(error);
        throw new ConnectionErrorException();
      }),
    );
  }

  findAllPending(): Observable<Transaction[]> {
    this.logger.log('Finding all payment providers ...');
    return from(
      this.prisma.transaction.findMany({ where: { state: State.PENDING } }),
    ).pipe(
      catchError((error) => {
        throw new ConnectionErrorException(
          `Something went wrong with data source \n ${error}`,
        );
      }),
    );
  }

  cancel(id: string) {
    return this.update(id, { state: State.CANCEL })
      .pipe(
        map((transaction) => {
          return {
            message: `Transaction ${transaction.id} cancelled successfully`,
          };
        }),
      )
      .pipe(
        catchError((error) => {
          console.error(error);
          throw error;
        }),
      );
  }

  findOneToRetry(id: string) {
    return from(
      this.prisma.transaction.findFirstOrThrow({
        where: {
          id: id,
          OR: [{ state: State.CREATED }, { state: State.FAILED }],
        },
      }),
    ).pipe(
      catchError((error) => {
        if (error.code && error.code === 'P2025')
          throw new BadRequestException(
            'We can only process transactions in CREATED and FAILED states.',
          );
        throw new ConnectionErrorException();
      }),
    );
  }
}
