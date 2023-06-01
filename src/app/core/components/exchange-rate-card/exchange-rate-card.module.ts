import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExchangeRateCardComponent } from './exchange-rate-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { NgOptimizedImage } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        NgOptimizedImage,
        PipesModule,
    ],
    declarations: [ExchangeRateCardComponent],
    exports: [ExchangeRateCardComponent]
})
export class ExchangeRateCardModule {}
