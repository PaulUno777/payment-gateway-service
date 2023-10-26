import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Observable, catchError, from, switchMap } from 'rxjs';
import { PrismaService } from '@app/common/prisma';
import { ConnectionErrorException } from '@app/common';
import {
  CreateReportRequest,
  UpdateReportRequest,
} from './dto/execution-report-request.dto copy';
import { ExecutionReport } from '@prisma/client';

@Injectable()
export class ExecutionReportService {
  private logger = new Logger();
  allPaginated() {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly prisma: PrismaService) {}

  create(request: CreateReportRequest): Observable<ExecutionReport> {
    return from(this.prisma.executionReport.create({ data: request })).pipe(
      catchError((error) => {
        console.error(error);
        throw new ConnectionErrorException();
      }),
    );
  }

  findLast(transactionId): Observable<ExecutionReport> {
    return from(
      this.prisma.executionReport.findFirst({
        where: { transactionId: transactionId },
        orderBy: { createdAt: 'desc' },
      }),
    ).pipe(
      catchError((error) => {
        if (error.code && error.code === 'P2025')
          throw new NotFoundException('Execution report not found');
        throw new ConnectionErrorException();
      }),
    );
  }

  update(transactionId: string, updateRequest: UpdateReportRequest) {
    this.logger.log('Update Execution Report');
    return from(this.findLast(transactionId)).pipe(
      switchMap((report) => {
        return from(
          this.prisma.executionReport.update({
            where: { id: report.id },
            data: updateRequest,
          }),
        );
      }),
      catchError((error) => {
        throw error;
      }),
    );
  }
}
