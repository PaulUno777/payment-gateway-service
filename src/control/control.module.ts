import { Module } from '@nestjs/common';
import { ControlService } from './control.service';
import { ControlController } from './control.controller';
import { TransactionModule } from 'src/transaction/transaction.module';
import { OperationModule } from 'src/operation/operation.module';

@Module({
  controllers: [ControlController],
  providers: [ControlService],
  imports: [TransactionModule, OperationModule],
})
export class ControlModule {}
