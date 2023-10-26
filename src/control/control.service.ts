import { Injectable, Logger } from '@nestjs/common';
import { TransactionService } from 'src/transaction/transaction.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OperationService } from 'src/operation/operation.service';
import { catchError, forkJoin, map, switchMap } from 'rxjs';

@Injectable()
export class ControlService {
  private readonly logger = new Logger(ControlService.name);
  constructor(
    private readonly transactionService: TransactionService,
    private readonly operationService: OperationService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES, { name: 'status checker job' })
  checkTransactionState() {
    this.logger.log('= = => [ Checking transactions state ] <= = =');
    return this.transactionService
      .findAllPending()
      .pipe(
        switchMap((transactions) => {
          return forkJoin(
            transactions.map((transaction) =>
              this.operationService.getStatus(transaction).pipe(
                map((response) => {
                  console.log(
                    `[checkState] state of tansaction ${response.transaction.id} ${response.transaction.state} [${response.success}]`,
                  );
                }),
                catchError((error) => {
                  throw error;
                }),
              ),
            ),
          );
        }),
      )
      .subscribe();
  }
}
