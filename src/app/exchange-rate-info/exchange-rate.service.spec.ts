import { ExchangeRateService } from './exchange-rate.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { map } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { iso4217 } from 'src/app/exchange-rate/iso4217.enum';
import { ExchangeRateMockInterceptor } from '../exchange-rate/exchange-rate-mock.interceptor';

describe('ExchangeRateService', () => {
    let exchangeRateService: ExchangeRateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                ExchangeRateService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: ExchangeRateMockInterceptor,
                    multi: true,
                },
            ],
        });
        exchangeRateService = TestBed.inject(ExchangeRateService);
        exchangeRateService.clear();
    });

    it('should be created', () => {
        expect(exchangeRateService).toBeTruthy();
    });

    it('should return expected currencies - GET', done => {
        const [source, target] = [iso4217.EUR, iso4217.USD];

        exchangeRateService
            .get(source, target)
            .pipe(map(response => ({ source: response.source, target: response.target })))
            .subscribe(partialExchangeRate => {
                expect(partialExchangeRate).toEqual({ source, target });
                done();
            });
    });

    it('has expected added exchangeRateHistory', done => {
        const exchangeRateInfo = {
            date: new Date().toISOString(),
            exchangeRateForced: '2',
            exchangeRateReal: 1.1,
            sourceCurrency: iso4217.EUR,
            sourceValue: '1',
            targetCurrency: iso4217.USD,
            targetValue: '2',
            variation: 0.8182,
        };
        exchangeRateService.add(exchangeRateInfo);
        expect(exchangeRateService.exchangeRateHistory.size).toBe(1);
        expect(exchangeRateService.exchangeRateHistory.get(exchangeRateInfo.date)).toEqual(exchangeRateInfo);
        expect(localStorage.getItem(exchangeRateInfo.date)).toEqual(JSON.stringify(exchangeRateInfo));
        done();
    });
});
