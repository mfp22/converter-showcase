import { ExchangeRate, ExchangeRateInfo, iso4217 } from 'src/app/models';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ExchangeRateService {
    readonly exchangeRateHistory: Map<string, ExchangeRateInfo> = new Map(
        Object.entries(localStorage).map(([key, value]) => {
            let val: any;
            try {
                val = JSON.parse(value);
            } catch (e) {
                val = value;
            }
            return [key, val];
        }),
    );

    constructor(private httpClient: HttpClient) {}

    add(exchangeRateInfo: ExchangeRateInfo): void {
        if (!this.exchangeRateHistory.get(exchangeRateInfo.date)) {
            if (this.exchangeRateHistory.size >= 5) {
                const min = Math.min(...Object.keys(localStorage).map((ISOString: string) => new Date(ISOString).getTime()));
                this.remove(new Date(min).toISOString());
            }
            this.exchangeRateHistory.set(exchangeRateInfo.date, exchangeRateInfo);
            localStorage.setItem(exchangeRateInfo.date, JSON.stringify(exchangeRateInfo));
        }
    }

    remove(exchangeRateInfoKey: string): void {
        this.exchangeRateHistory.delete(exchangeRateInfoKey);
        localStorage.removeItem(exchangeRateInfoKey);
    }

    get(source: iso4217, target: iso4217): Observable<ExchangeRate> {
        return this.httpClient.get<ExchangeRate>(`/exchange-rate/source/${source}/target/${target}`);
    }

    clear(): void {
        Object.keys(this.exchangeRateHistory).forEach((key: string) => this.remove(key));
    }
}
