import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ExchangeRateInfo } from 'src/app/core/models';

@Component({
    selector: 'app-exchange-rate-card',
    templateUrl: 'exchange-rate-card.component.html',
    styleUrls: ['exchange-rate-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExchangeRateCardComponent {
    @Input() exchangeRate!: ExchangeRateInfo;
    @Output() deleteRequest = new EventEmitter<ExchangeRateInfo>();
}
