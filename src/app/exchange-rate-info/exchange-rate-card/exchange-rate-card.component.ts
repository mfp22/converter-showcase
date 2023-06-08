import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ExchangeRateInfo } from '../exchange-rate-infos.type';
import { NoDataPipe } from 'src/app/pipes';

@Component({
    selector: 'app-exchange-rate-card',
    templateUrl: 'exchange-rate-card.component.html',
    styleUrls: ['exchange-rate-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, NoDataPipe],
})
export class ExchangeRateCardComponent {
    @Input() exchangeRate: ExchangeRateInfo | undefined;
    @Output() deleteRequest = new EventEmitter<ExchangeRateInfo>();
}
