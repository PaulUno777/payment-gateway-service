import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { catchError, firstValueFrom, from, map } from 'rxjs';
import { CurrencyapiService } from './currency-api.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  ConvertCurrencyRequest,
  ConvertCurrencyResponse,
} from './dto/currency.dto';

@Injectable()
export class CurrencyService implements OnApplicationBootstrap {
  private currencyRateBasedOnEUR;
  private updateDate;

  constructor(private currencyapiService: CurrencyapiService) {}

  async onApplicationBootstrap() {
    await firstValueFrom(this.updateExchangeRate());
  }

  convertCurrency(query: ConvertCurrencyRequest): ConvertCurrencyResponse {
    console.log('query', query);
    const { from, to, amount } = query;
    if (!this.currencyRateBasedOnEUR[from] || !this.currencyRateBasedOnEUR[to])
      throw new Error('Some currency is currently Unsupported.');

    const fomRate = this.currencyRateBasedOnEUR[from] || 1;
    const toRate = this.currencyRateBasedOnEUR[to] || 1;
    const conversionRate = toRate / fomRate;

    const amountInEUR = Number(amount) / fomRate;
    const convertedAmount = amountInEUR * toRate;

    const result = new ConvertCurrencyResponse();
    result.query = query;
    result.updatedAt = this.updateDate;
    result.result = {
      rate: conversionRate,
      amount: Math.round(convertedAmount),
    };

    return result;
  }

  @Cron(CronExpression.EVERY_HOUR)
  updateExchangeRate() {
    return from(this.currencyapiService.latest({ base: 'EUR' })).pipe(
      map((response) => {
        if (response.success) {
          console.log('Currency rates based on EUR updated');
          this.currencyRateBasedOnEUR = response.rates;
          this.updateDate = response.date;
        }
      }),
      catchError((error) => {
        throw error;
      }),
    );
  }
}
