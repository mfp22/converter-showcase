import { iso4217 } from ".";

export type exchangeRateInfo = {
    date: string;
    exchangeRateForced: string;
    exchangeRateReal: number;
    sourceCurrency: iso4217;
    sourceValue: string;
    targetCurrency: iso4217;
    targetValue: string;
    variation: number|null;
}
