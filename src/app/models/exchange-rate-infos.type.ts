import { iso4217 } from ".";

export type ExchangeRateInfo = {
    date: string;
    exchangeRateForced: string;
    exchangeRateReal: number;
    sourceCurrency: iso4217;
    sourceValue: string;
    targetCurrency: iso4217;
    targetValue: string;
    variation: number|null;
};
