import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PhoneHelperModule } from '@app/phone-helper';
import { ExecutionReportService } from './execution-report.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, ExecutionReportService],
  imports: [PhoneHelperModule],
  exports: [TransactionService, ExecutionReportService],
})
export class TransactionModule {}
