import { ChangeDetectionStrategy, Component } from '@angular/core';
import { exchangeRate, exchangeRateInfo, iso4217 } from 'src/app/core/models';
import { ExchangeRateService } from 'src/app/core/services';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionSupervisorComponent } from 'src/app/core/components/subscription-supervisor/subscription-supervisor.component';
import { tap, withLatestFrom, share, filter, Observable } from 'rxjs';

@Component({
    selector: 'app-converter',
    templateUrl: 'converter.component.html',
    styleUrls: ['converter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConverterComponent extends SubscriptionSupervisorComponent {
    exchangeRateGapLimit = 0.02;
    readonly floatRegex = /^(?:[1-9]\d*|0(?!(?:\.0+)?$)){1}(?:\.\d{1,2})?$/
    readonly iso4217: iso4217[] = Object.values(iso4217);
    readonly changeForm = this.formBuilder.group({
        exchangeRateForced: this.formBuilder.nonNullable.control('', {
            validators: [
                Validators.pattern(this.floatRegex),
            ],
        }),
        cashSource: this.formBuilder.nonNullable.group({
            amount: this.formBuilder.nonNullable.control(
                '',
                {validators: [
                    Validators.pattern(this.floatRegex),
                    Validators.required,
                ]}
            ),
            currency: iso4217.EUR,
        }),
        cashTarget: this.formBuilder.nonNullable.group({
            amount: this.formBuilder.nonNullable.control(
                '',
                {validators: [
                    Validators.pattern(this.floatRegex),
                    Validators.required,
                ]}
            ),
            currency: iso4217.USD,
        }),
    });

    readonly exchangeRateReal$: Observable<exchangeRate> = this.exchangeRateService.exchangeRate$.pipe(
        tap(exchangeRate => {
            /**
             * RealTime exchangeRateGap validation request.
             * 
             * Cause we want realtime validation, we use manual validation instead of formControl validation function injection.
             */
            const exchangeRateGap = this.exchangeRateGap(exchangeRate.rate);
            this.changeForm.controls.exchangeRateForced.updateValueAndValidity();
            if (
                this.changeForm.controls.exchangeRateForced.value &&
                Math.abs(exchangeRateGap) > this.exchangeRateGapLimit
            ) {
                this.changeForm.controls.exchangeRateForced.setErrors({limitValidator: {required: this.exchangeRateGapLimit, actual: exchangeRateGap}})
            }
        }),
        tap(exchangeRate => {
            if (
                this.changeForm.controls.cashSource.controls.amount.valid &&
                (!this.changeForm.controls.exchangeRateForced.valid || !this.changeForm.controls.exchangeRateForced.value)
            ) {
                this.changeForm.controls.cashTarget.controls.amount.setValue(
                    this.changeForm.controls.cashSource.controls.amount.value ?
                        `${((Number(this.changeForm.controls.cashSource.controls.amount.value) * exchangeRate.rate).toFixed(2))}` :
                        '', {
                        emitEvent: false,
                    }
                )
            }
        }),
        share(),
    );
    readonly cashSourceChanges$ = this.changeForm.controls.cashSource.valueChanges.pipe(
        withLatestFrom(this.exchangeRateReal$),
        tap(([cashSource, exchangeRateReal]) => {
            const exchangeRate = this.changeForm.controls.exchangeRateForced.valid && this.changeForm.controls.exchangeRateForced.value ?
                Number(this.changeForm.controls.exchangeRateForced.value) : exchangeRateReal.rate;
            this.changeForm.controls.cashTarget.controls.amount.setValue(
                this.changeForm.controls.cashSource.controls.amount.valid && this.changeForm.controls.cashSource.controls.amount.value ?
                    `${(Number(cashSource.amount) * exchangeRate).toFixed(2)}` :
                    '', {
                    emitEvent: false,
                }
            );
        }),
    );
    readonly cashTargetChanges$ = this.changeForm.controls.cashTarget.valueChanges.pipe(
        withLatestFrom(this.exchangeRateReal$),
        tap(([cashTarget, exchangeRateReal]) => {
            const exchangeRate = this.changeForm.controls.exchangeRateForced.valid && this.changeForm.controls.exchangeRateForced.value ?
                Number(this.changeForm.controls.exchangeRateForced.value) : exchangeRateReal.rate;
            this.changeForm.controls.cashSource.controls.amount.setValue(
                this.changeForm.controls.cashTarget.controls.amount.valid && this.changeForm.controls.cashTarget.controls.amount.value ?
                    `${(Number(cashTarget.amount) / exchangeRate).toFixed(2)}` :
                    '', {
                    emitEvent: false,
                }
            )
        }),
    );
    readonly exchangeRateForcedChanges$ = this.changeForm.controls.exchangeRateForced.valueChanges.pipe(
        filter(() => this.changeForm.controls.exchangeRateForced.valid),
        withLatestFrom(this.exchangeRateReal$),
        tap(([exchangeRate, realExchangeRate]) => {
            this.changeForm.controls.cashTarget.controls.amount.setValue(
                this.changeForm.controls.cashSource.controls.amount.valid && this.changeForm.controls.cashSource.controls.amount.value ?
                    `${(Number(this.changeForm.controls.cashSource.controls.amount.value) * Number(exchangeRate ? exchangeRate : realExchangeRate)).toFixed(2)}` :
                    '',
                {
                    emitEvent: false,
                }
            );
        }),
    )

    constructor(
        public exchangeRateService: ExchangeRateService,
        private formBuilder: FormBuilder,
    ) {
        super();
        this.cashSourceChanges$.pipe(this.unsubsribeOnDestroy).subscribe();
        this.cashTargetChanges$.pipe(this.unsubsribeOnDestroy).subscribe();
        this.exchangeRateForcedChanges$.pipe(this.unsubsribeOnDestroy).subscribe();
    }

    save(exchangeRateReal: exchangeRate): void {
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

    delete(exchangeRateInfo: exchangeRateInfo): void {
        this.exchangeRateService.remove(exchangeRateInfo.date);
    }

    switch(): void {
        const cashTargetCurrency = this.changeForm.controls.cashTarget.controls.currency.value;
        this.changeForm.controls.cashTarget.controls.currency.setValue(
            this.changeForm.controls.cashSource.controls.currency.value,
            {
                emitEvent: false,
            }
        );
        this.changeForm.controls.cashSource.setValue({
            amount: this.changeForm.controls.cashTarget.controls.amount.value,
            currency: cashTargetCurrency,
        });
    }

    exchangeRateGap(exchangeRateReferance: number): number {
        if (+this.changeForm.controls.exchangeRateForced.value === 0) {
            return this.exchangeRateGapLimit+1
        }
        const a = +(+this.changeForm.controls.exchangeRateForced.value - exchangeRateReferance).toFixed(2);
        const b = +(a/exchangeRateReferance).toFixed(10)
        return b;
    }
}