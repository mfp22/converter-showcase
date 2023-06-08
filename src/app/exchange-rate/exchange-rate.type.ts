import { iso4217 } from './iso4217.enum';

export type ExchangeRate = {
    date: string; // ISO-8601
    rate: number;
    source: iso4217;
    target: iso4217;
};
