import { ExchangeRate, ExchangeRateInfo, iso4217 } from 'src/app/models';
import { Injectable } from '@angular/core';
import { Observable, map, scan, share, timer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ExchangeRateService {
    source = iso4217.EUR;
    target = iso4217.USD;
    readonly exchangeRate$: Observable<ExchangeRate> = timer(0, 1000).pipe(
        map(() => {return {
            source: this.source,
            target: this.target,
            rate: 1.1,
            date: (new Date()).toISOString(),
        }}),
        scan((acc: ExchangeRate) => {return {
            source: this.source,
            target: this.target,
            rate: Number((acc.rate + Number((Math.random() * .1 -.05).toFixed(2))).toFixed(2)),
            date: (new Date()).toISOString(),
        }}),
        share(),
    )
    readonly exchangeRateHistory: Map<string, ExchangeRateInfo> = new Map(Object.entries(localStorage).map(([key, value]) => {
        return [key, JSON.parse(value)];
    }));

    add(exchangeRateInfo: ExchangeRateInfo): void {
        if (!this.exchangeRateHistory.get(exchangeRateInfo.date)) {
            if (this.exchangeRateHistory.size >= 5) {
                const min = Math.min(...Object.keys(localStorage).map((ISOString: string) => (new Date(ISOString).getTime())))
                this.remove((new Date(min).toISOString()));
            }
            this.exchangeRateHistory.set(exchangeRateInfo.date, exchangeRateInfo);
            localStorage.setItem(exchangeRateInfo.date, JSON.stringify(exchangeRateInfo));
        }
    }

    remove(exchangeRateInfoKey: string): void {
        this.exchangeRateHistory.delete(exchangeRateInfoKey);
        localStorage.removeItem(exchangeRateInfoKey);
    }
}
