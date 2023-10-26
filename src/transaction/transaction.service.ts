import { Pageable } from './../../libs/common/src/prisma/prisma.service';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Observable, catchError, from, map, switchMap } from 'rxjs';
import { PrismaService } from '@app/common/prisma';
import { ConnectionErrorException } from '@app/common';
import {
  CreateTransactionRequest,
  PageableTransaction,
  UpdateTransactionRequest,
} from './dto/transaction-request.dto';
import { State, Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
  private logger = new Logger(TransactionService.name);
  constructor(private readonly prisma: PrismaService) {}

  create(request: CreateTransactionRequest) {
    this.logger.log('----- Create a transaction -----');
    return from(this.prisma.transaction.create({ data: request })).pipe(
      catchError((error) => {
        throw new ConnectionErrorException(
          `Something went wrong with data source \n ${error}`,
        );
      }),
    );
  }

  findAllPending(): Observable<Transaction[]> {
    this.logger.log('----- Find all pending transactions -----');
    return from(
      this.prisma.transaction.findMany({
        where: { state: State.PENDING },
      }),
    ).pipe(
      catchError((error) => {
        throw new ConnectionErrorException(
          `Something went wrong with data source \n ${error}`,
        );
      }),
    );
  }

  findAllPaginated(request: PageableTransaction) {
    this.logger.log(
      '----- Find all filterd sorted and paginated transactions -----',
    );
    const pageable: Pageable = {
      page: request.page ?? 1,
      size: request.size ?? 20,
      sort: request.sort ?? [],
      filter: request.filter ?? [],
    };
    return from(this.prisma.paginate('transaction', pageable));
  }

  findOne(id: string) {
    this.logger.log('----- Find all pending transactions -----');

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

  findOneToRetry(id: string) {
    this.logger.log('----- Find transaction to process -----');

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
          throw new ConflictException(
            'We can only process transactions in CREATED or FAILED states.',
          );
        throw new ConnectionErrorException();
      }),
    );
  }

  update(
    id: string,
    updateRequest: UpdateTransactionRequest,
  ): Observable<Transaction> {
    this.logger.log('----- Find a transaction based on id -----');

    return this.findOne(id).pipe(
      switchMap((transaction) => {
        return from(
          this.prisma.transaction.update({
            where: { id: transaction.id },
            data: updateRequest,
            include: { executionReports: true },
          }),
        );
      }),
      catchError((error) => {
        console.error(error);
        throw new ConnectionErrorException();
      }),
    );
  }

  cancel(id: string) {
    this.logger.log('----- Cancel a transaction -----');

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
}
