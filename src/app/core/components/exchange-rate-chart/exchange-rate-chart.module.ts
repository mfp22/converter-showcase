import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { ExchangeRateChartComponent } from './exchange-rate-chart.component';

@NgModule({
    imports: [
        CommonModule,
        NgxEchartsModule,
    ],
    declarations: [ExchangeRateChartComponent],
    exports: [ExchangeRateChartComponent],
})
export class ExchangeRateChartModule {}
