import { Injectable } from '@nestjs/common';
import fetch from 'isomorphic-fetch';

@Injectable()
export class CurrencyapiService {
  private baseUrl = 'http://api.exchangeratesapi.io/v1/';

  private async call(endpoint: string, params = {}) {
    const paramString = new URLSearchParams({
      ...params,
    }).toString();

    const key = process.env.FREE_CURRENCY_API_KEY;

    const url = `${this.baseUrl}${endpoint}?access_key=${key}&${paramString}`;
    console.log('[ Api Call On ] ', url);
    const response = await fetch(url, {});

    const data = await response.json();
    return data;
  }

  status() {
    return this.call('status');
  }

  currencies(params: any) {
    return this.call('currencies', params);
  }

  latest(params: any) {
    return this.call('latest', params);
  }
}
