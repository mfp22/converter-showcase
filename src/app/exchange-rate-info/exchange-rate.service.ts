import { ExchangeRateInfo } from './exchange-rate-infos.type';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { iso4217 } from 'src/app/exchange-rate/iso4217.enum';
import { ExchangeRate } from 'src/app/exchange-rate/exchange-rate.type';

@Injectable({ providedIn: 'root' })
export class ExchangeRateService {
    readonly exchangeRateHistory = this.getExchangeRateHistory();

    constructor(private httpClient: HttpClient) {}

    add(exchangeRateInfo: ExchangeRateInfo): void {
        if (!this.exchangeRateHistory.get(exchangeRateInfo.date)) {
            if (this.exchangeRateHistory.size >= 5) {
                const history = this.getExchangeRateHistory();
                const min = Math.min(...Array.from(history.keys()).map((ISOString: string) => new Date(ISOString).getTime()));
                this.remove(new Date(min).toISOString());
            }
            this.exchangeRateHistory.set(exchangeRateInfo.date, exchangeRateInfo);
            const history = JSON.parse(localStorage.getItem('history') || '{}') as Record<string, string>;
            history[exchangeRateInfo.date] = JSON.stringify(exchangeRateInfo);
            localStorage.setItem('history', JSON.stringify(history));
        }
    }

    remove(exchangeRateInfoKey: string): void {
        this.exchangeRateHistory.delete(exchangeRateInfoKey);
        const oldHistory = JSON.parse(localStorage.getItem('history') || '{}') as Record<string, string>;
        delete oldHistory[exchangeRateInfoKey];
        localStorage.setItem('history', JSON.stringify(oldHistory));
    }

    get(source: iso4217, target: iso4217): Observable<ExchangeRate> {
        return this.httpClient.get<ExchangeRate>(`/exchange-rate/source/${source}/target/${target}`);
    }

    clear(): void {
        Object.keys(this.exchangeRateHistory).forEach((key: string) => this.remove(key));
    }

    private getExchangeRateHistory(): Map<string, ExchangeRateInfo> {
        const history = JSON.parse(localStorage.getItem('history') || '{}') as Record<string, string>;
        return new Map(
            Object.entries(history).map(([key, value]) => {
                return [key, JSON.parse(value)];
            }),
        );
    }
}
