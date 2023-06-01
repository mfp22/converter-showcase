import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { exchangeRateInfo } from 'src/app/core/models';

@Component({
    selector: 'app-exchange-rate-card',
    templateUrl: 'exchange-rate-card.component.html',
    styleUrls: ['exchange-rate-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExchangeRateCardComponent {
    @Input() exchangeRate!: exchangeRateInfo;
    @Output() deleteRequest = new EventEmitter<exchangeRateInfo>();
}
