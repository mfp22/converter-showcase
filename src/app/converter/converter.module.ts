import { AsyncPipe, CommonModule } from '@angular/common';
import { ConverterComponent } from './converter.component';
import { ConverterRoutingModule } from './converter-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LetModule } from '@ngrx/component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { ExchangeRateChartModule } from 'src/app/core/components/exchange-rate-chart/exchange-rate-chart.module';
import { ExchangeRateCardModule } from 'src/app/core/components/exchange-rate-card/exchange-rate-card.module';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
    declarations: [
        ConverterComponent,
    ],
    imports: [
        CommonModule,
        ConverterRoutingModule,
        DirectivesModule,
        ExchangeRateCardModule,
        ExchangeRateChartModule,
        FormsModule,
        LetModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        PipesModule,
    ],
    providers: [
        AsyncPipe,
    ],
})
export class ConverterModule {}
