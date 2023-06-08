import { iso4217 } from 'src/app/exchange-rate/iso4217.enum';

export type ExchangeRateInfo = {
    date: string;
    exchangeRateForced: string;
    exchangeRateReal: number;
    sourceCurrency: iso4217;
    sourceValue: string;
    targetCurrency: iso4217;
    targetValue: string;
    variation: number | null;
};
