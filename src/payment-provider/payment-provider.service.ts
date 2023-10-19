import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePaymentProviderRequest } from './dto/create-payment-provider.dto';
import { UpdatePaymentProviderRequest } from './dto/update-payment-provider.dto';
import { ConnectionErrorException } from '@app/common';
import { Observable, catchError, from, map, switchMap } from 'rxjs';
import { PaymentProvider, ProviderCode } from '@prisma/client';
import { PrismaService } from '@app/common/prisma';

@Injectable()
export class PaymentProviderService {
  private readonly logger = new Logger(PaymentProviderService.name);
  constructor(private readonly prisma: PrismaService) {}

  create(createRequest: CreatePaymentProviderRequest): Observable<any> {
    this.logger.log('Creating payment provider ...');
    return from(
      this.prisma.paymentProvider.create({
        data: createRequest,
      }),
    ).pipe(
      map((response) => {
        return { message: 'Created successfully', entity: response };
      }),
      catchError((error) => {
        throw new ConnectionErrorException(error);
      }),
    );
  }

  findAll(): Observable<PaymentProvider[]> {
    this.logger.log('Finding all payment providers ...');
    return from(this.prisma.paymentProvider.findMany()).pipe(
      catchError((error) => {
        throw new ConnectionErrorException(
          `Something went wrong with data source \n ${error}`,
        );
      }),
    );
  }

  findOne(id: string): Observable<PaymentProvider> {
    this.logger.log('Finding payment provider by id ...');
    return from(
      this.prisma.paymentProvider.findFirstOrThrow({ where: { id: id } }),
    ).pipe(
      catchError((error) => {
        if (error.code === 'P2025') throw new NotFoundException();
        throw new ConnectionErrorException();
      }),
    );
  }

  findByCode(code: ProviderCode): Observable<PaymentProvider> {
    this.logger.log('Finding payment provider by code ...');
    return from(
      this.prisma.paymentProvider.findFirstOrThrow({
        where: { code: code },
      }),
    ).pipe(
      catchError((error) => {
        if (error.code === 'P2025') throw new NotFoundException();
        throw new ConnectionErrorException();
      }),
    );
  }

  update(
    id: string,
    updateRequest: UpdatePaymentProviderRequest,
  ): Observable<any> {
    this.logger.log('Updating payment provider ...');
    this.findOne(id).subscribe({
      error(error) {
        throw error;
      },
    });

    return from(
      this.prisma.paymentProvider.update({
        where: { id: id },
        data: updateRequest,
      }),
    ).pipe(
      map((response) => {
        return { message: 'Updated successfully', entity: response };
      }),
      catchError((error) => {
        throw new ConnectionErrorException(error);
      }),
    );
  }

  toggleActivation(id: string): Observable<{ message: string }> {
    this.logger.log('Toggle activation state of payment provider ...');
    return this.findOne(id).pipe(
      switchMap((entity) => {
        return from(
          this.prisma.paymentProvider.update({
            where: { id: id },
            data: { isActive: !entity.isActive },
          }),
        ).pipe(
          catchError((error) => {
            throw new ConnectionErrorException(error);
          }),
        );
      }),
      map((response) => {
        const message = { message: '' };
        response.isActive
          ? (message.message = 'Provider activated successfully')
          : (message.message = 'Provider deactivated successfully');
        return message;
      }),
      catchError((error) => {
        throw error;
      }),
    );
  }
}
