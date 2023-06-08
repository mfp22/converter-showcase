import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConverterComponent } from './converter.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExchangeRateService } from 'src/app/services';
import { iso4217 } from 'src/app/exchange-rate/iso4217.enum';
import { ExchangeRateMockInterceptor } from '../../exchange-rate/exchange-rate-mock.interceptor';

describe('ConverterComponent', () => {
    let component: ConverterComponent;
    let fixture: ComponentFixture<ConverterComponent>;
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
        fixture = TestBed.createComponent(ConverterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Switch currencies correctly', () => {
        const [source, target] = [iso4217.USD, iso4217.EUR];

        component.switch();
        expect(component.changeForm.controls.cashSource.controls.currency.value).toEqual(source);
        expect(component.changeForm.controls.cashTarget.controls.currency.value).toEqual(target);
    });
});
