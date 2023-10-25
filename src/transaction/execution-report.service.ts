import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { catchError, from, switchMap } from 'rxjs';
import { PrismaService } from '@app/common/prisma';
import { ConnectionErrorException } from '@app/common';
import {
  CreateReportRequest,
  UpdateReportRequest,
} from './dto/execution-report-request.dto copy';

@Injectable()
export class ExecutionReportService {
  private logger = new Logger();
  allPaginated() {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly prisma: PrismaService) {}

  create(request: CreateReportRequest) {
    return from(this.prisma.executionReport.create({ data: request })).pipe(
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
    this.logger.log('Find an Execution Report based on id');
    return from(
      this.prisma.executionReport.findFirstOrThrow({ where: { id: id } }),
    ).pipe(
      catchError((error) => {
        console.error(error);
        if (error.code && error.code === 'P2025')
          throw new NotFoundException('Transation not found');
        throw new ConnectionErrorException();
      }),
    );
  }

  update(id: string, updateRequest: UpdateReportRequest) {
    this.logger.log('Update Execution Report');
    return from(this.findOne(id)).pipe(
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
