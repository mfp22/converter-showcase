import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ExchangeRateInfo } from '../exchange-rate-infos.type';
import { ExchangeRateCardComponent } from 'src/app/exchange-rate-info/exchange-rate-card/exchange-rate-card.component';
import { ExchangeRateChartComponent } from 'src/app/exchange-rate/exchange-rate-chart.component';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GridDirective } from 'src/app/grid/grid.directive';
import { LetDirective } from '@ngrx/component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReversePipe, NoDataPipe } from 'src/app/pipes';
import { SubscriptionSupervisorComponent } from 'src/app/subscription-supervisor/subscription-supervisor.component';
import { combineLatest, filter, interval, mergeMap, Observable, share, startWith, tap, withLatestFrom } from 'rxjs';
import { ExchangeRate } from '../../exchange-rate/exchange-rate.type';
import { iso4217 } from 'src/app/exchange-rate/iso4217.enum';
import { ExchangeRateService } from '../exchange-rate.service';

@Component({
    selector: 'app-converter',
    templateUrl: 'converter.component.html',
    styleUrls: ['converter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        ReversePipe,
        NoDataPipe,
        GridDirective,
        CommonModule,
        ExchangeRateCardComponent,
        ExchangeRateChartComponent,
        FormsModule,
        LetDirective,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
    ],
    providers: [AsyncPipe],
})
export class ConverterComponent extends SubscriptionSupervisorComponent {
    exchangeRateGapLimit = 0.02;
    readonly floatRegex = /^(?:[1-9]\d*|0(?!(?:\.0+)?$)){1}(?:\.\d{1,2})?$/;
    readonly iso4217: iso4217[] = Object.values(iso4217);
    readonly changeForm = this.formBuilder.group({
        exchangeRateForced: this.formBuilder.nonNullable.control('', {
            validators: [Validators.pattern(this.floatRegex)],
        }),
        cashSource: this.formBuilder.nonNullable.group({
            amount: this.formBuilder.nonNullable.control('', {
                validators: [Validators.pattern(this.floatRegex), Validators.required],
            }),
            currency: iso4217.EUR,
        }),
        cashTarget: this.formBuilder.nonNullable.group({
            amount: this.formBuilder.nonNullable.control('', {
                validators: [Validators.pattern(this.floatRegex), Validators.required],
            }),
            currency: iso4217.USD,
        }),
    });

    readonly exchangeRateReal$: Observable<ExchangeRate> = interval(1000).pipe(
        mergeMap(() =>
            this.exchangeRateService.get(
                this.changeForm.controls.cashSource.controls.currency.value,
                this.changeForm.controls.cashTarget.controls.currency.value,
            ),
        ),
        tap((exchangeRate: ExchangeRate) => {
            /**
             * RealTime exchangeRateGap validation request.
             *
             * Cause we want realtime validation, we use manual validation instead of formControl validation function injection.
             */
            const exchangeRateGap = this.exchangeRateGap(exchangeRate.rate);
            this.changeForm.controls.exchangeRateForced.updateValueAndValidity();
            if (this.changeForm.controls.exchangeRateForced.value && Math.abs(exchangeRateGap) > this.exchangeRateGapLimit) {
                this.changeForm.controls.exchangeRateForced.setErrors({
                    limitValidator: { required: this.exchangeRateGapLimit, actual: exchangeRateGap },
                });
            }
        }),
        tap(exchangeRate => {
            if (
                this.changeForm.controls.cashSource.controls.amount.valid &&
                (!this.changeForm.controls.exchangeRateForced.valid || !this.changeForm.controls.exchangeRateForced.value)
            ) {
                this.changeForm.controls.cashTarget.controls.amount.setValue(
                    this.changeForm.controls.cashSource.controls.amount.value
                        ? `${(Number(this.changeForm.controls.cashSource.controls.amount.value) * exchangeRate.rate).toFixed(2)}`
                        : '',
                    {
                        emitEvent: false,
                    },
                );
            }
        }),
        share(),
    );
    readonly cashSourceChanges$ = this.changeForm.controls.cashSource.valueChanges.pipe(
        withLatestFrom(this.exchangeRateReal$),
        tap(([cashSource, exchangeRateReal]) => {
            const exchangeRate =
                this.changeForm.controls.exchangeRateForced.valid && this.changeForm.controls.exchangeRateForced.value
                    ? Number(this.changeForm.controls.exchangeRateForced.value)
                    : exchangeRateReal.rate;
            this.changeForm.controls.cashTarget.controls.amount.setValue(
                this.changeForm.controls.cashSource.controls.amount.valid &&
                    this.changeForm.controls.cashSource.controls.amount.value
                    ? `${(Number(cashSource.amount) * exchangeRate).toFixed(2)}`
                    : '',
                {
                    emitEvent: false,
                },
            );
        }),
    );
    readonly cashTargetChanges$ = this.changeForm.controls.cashTarget.valueChanges.pipe(
        withLatestFrom(this.exchangeRateReal$),
        tap(([cashTarget, exchangeRateReal]) => {
            const exchangeRate =
                this.changeForm.controls.exchangeRateForced.valid && this.changeForm.controls.exchangeRateForced.value
                    ? Number(this.changeForm.controls.exchangeRateForced.value)
                    : exchangeRateReal.rate;
            this.changeForm.controls.cashSource.controls.amount.setValue(
                this.changeForm.controls.cashTarget.controls.amount.valid &&
                    this.changeForm.controls.cashTarget.controls.amount.value
                    ? `${(Number(cashTarget.amount) / exchangeRate).toFixed(2)}`
                    : '',
                {
                    emitEvent: false,
                },
            );
        }),
    );
    readonly exchangeRateForcedChanges$ = this.changeForm.controls.exchangeRateForced.valueChanges.pipe(
        filter(() => this.changeForm.controls.exchangeRateForced.valid),
        withLatestFrom(this.exchangeRateReal$),
        tap(([exchangeRate, realExchangeRate]) => {
            this.changeForm.controls.cashTarget.controls.amount.setValue(
                this.changeForm.controls.cashSource.controls.amount.valid &&
                    this.changeForm.controls.cashSource.controls.amount.value
                    ? `${(
                          Number(this.changeForm.controls.cashSource.controls.amount.value) *
                          Number(exchangeRate ? exchangeRate : realExchangeRate)
                      ).toFixed(2)}`
                    : '',
                {
                    emitEvent: false,
                },
            );
        }),
    );
    readonly currencies$ = combineLatest([
        this.changeForm.controls.cashSource.controls.currency.valueChanges.pipe(
            startWith(this.changeForm.controls.cashSource.controls.currency.value),
        ),
        this.changeForm.controls.cashTarget.controls.currency.valueChanges.pipe(
            startWith(this.changeForm.controls.cashTarget.controls.currency.value),
        ),
    ]);

    constructor(public exchangeRateService: ExchangeRateService, private formBuilder: FormBuilder) {
        super();
        this.cashSourceChanges$.pipe(this.unsubsribeOnDestroy).subscribe();
        this.cashTargetChanges$.pipe(this.unsubsribeOnDestroy).subscribe();
        this.exchangeRateForcedChanges$.pipe(this.unsubsribeOnDestroy).subscribe();
        this.currencies$.pipe(this.unsubsribeOnDestroy).subscribe();
    }

    save(exchangeRateReal: ExchangeRate): void {
        if (
            this.changeForm.controls.cashSource.controls.amount.value &&
            this.changeForm.controls.cashTarget.controls.amount.value &&
            this.changeForm.controls.cashSource.controls.amount.valid &&
            this.changeForm.controls.cashTarget.controls.amount.valid
        ) {
            this.exchangeRateService.add({
                date: exchangeRateReal.date,
                exchangeRateForced: this.changeForm.controls.exchangeRateForced.value,
                exchangeRateReal: exchangeRateReal.rate,
                sourceCurrency: exchangeRateReal.source,
                sourceValue: this.changeForm.controls.cashSource.value.amount as string,
                targetCurrency: this.changeForm.controls.cashTarget.value.currency as iso4217,
                targetValue: this.changeForm.controls.cashTarget.value.amount as string,
                variation: this.changeForm.controls.exchangeRateForced.value ? this.exchangeRateGap(exchangeRateReal.rate) : null,
            });
        }
    }

    delete(exchangeRateInfo: ExchangeRateInfo): void {
        this.exchangeRateService.remove(exchangeRateInfo.date);
    }

    switch(): void {
        const cashTargetCurrency = this.changeForm.controls.cashTarget.controls.currency.value;
        this.changeForm.controls.cashTarget.setValue({
            amount: this.changeForm.controls.cashSource.controls.amount.value,
            currency: this.changeForm.controls.cashSource.controls.currency.value,
        });
        this.changeForm.controls.cashSource.setValue({
            amount: this.changeForm.controls.cashTarget.controls.amount.value,
            currency: cashTargetCurrency,
        });
    }

    exchangeRateGap(exchangeRateReferance: number): number {
        if (+this.changeForm.controls.exchangeRateForced.value === 0) {
            return this.exchangeRateGapLimit + 1;
        }
        const a = +(+this.changeForm.controls.exchangeRateForced.value - exchangeRateReferance).toFixed(2);
        const b = +(a / exchangeRateReferance).toFixed(10);
        return b;
    }
}
