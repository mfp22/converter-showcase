import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ExchangeRate } from './exchange-rate.type';
import { iso4217 } from './iso4217.enum';

@Injectable()
export class ExchangeRateMockInterceptor implements HttpInterceptor {
    private exchangeRate = 1.1;
    private previousCurrencies = '';

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const [match, source, target] = request.url.match(/.*\/exchange-rate\/source\/([A-Z]{3})\/target\/([A-Z]{3})$/) || [
            undefined,
            '',
            '',
        ];
        if (request.method === 'GET' && match) {
            const newCurrencies = source + target;
            if (newCurrencies !== this.previousCurrencies) {
                this.previousCurrencies = newCurrencies;
                this.exchangeRate = 1.1;
            }
            return of(this.exchangeRate).pipe(
                tap(() => {
                    this.exchangeRate = Number((this.exchangeRate + Number((Math.random() * 0.1 - 0.05).toFixed(2))).toFixed(2));
                }),
                map((rate: number) => {
                    return {
                        source: source as iso4217,
                        target: target as iso4217,
                        rate,
                        date: new Date().toISOString(),
                    };
                }),
                map((body: ExchangeRate) => new HttpResponse({ status: 200, body })),
            );
        }
        return next.handle(request);
    }
}
