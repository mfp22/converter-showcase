import { Component, Input, OnChanges } from '@angular/core';
import { ExchangeRate } from 'src/app/core/models';
import { Observable, bufferCount, scan, tap } from 'rxjs';
import { SubscriptionSupervisorComponent } from 'src/app/core/components/subscription-supervisor/subscription-supervisor.component';
import * as echarts from 'echarts';

@Component({
  selector: 'app-exchange-rate-chart',
  templateUrl: 'exchange-rate-chart.component.html',
  styleUrls: ['exchange-rate-chart.component.scss'],
})
export class ExchangeRateChartComponent extends SubscriptionSupervisorComponent implements OnChanges {
  @Input() exchangeRate$!: Observable<ExchangeRate>;

  isLoading = true;
  updateOptions: Partial<echarts.EChartsOption> = {};
  
  readonly chartOption: echarts.EChartsOption = {
    title: this.processTitle(),
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '.6%',
      right: '3%',
      height: '80%',
      containLabel: true
    },
    toolbox: {
      feature: {
        dataView: { readOnly: true, buttonColor: '#5C7BD9' },
        saveAsImage: {},
      }
    },
    xAxis: this.processXAxis(),
    yAxis: {
      type: 'value'
    },
    series: this.processSeries()
  };
  readonly maximumDatas = 60;

  constructor() {
      super();
  }

  ngOnChanges(): void {
    this.chartOption.series = this.processSeries();
    this.exchangeRate$.pipe(
      this.unsubsribeOnDestroy,
      bufferCount(1, 1),
      tap(() => this.isLoading = false),
      scan((acc, val) => {
        acc = [...acc, ...val];
        if (acc.length > this.maximumDatas) {
          acc.shift();
        }
        return acc;
      }),
      tap((exchangeRates: ExchangeRate[]) => {
        this.updateOptions = {
          series: this.processSeries(exchangeRates.map((exchangeRate) => exchangeRate.rate)),
          title: this.processTitle(...exchangeRates),
          xAxis: this.processXAxis(exchangeRates.map((exchangeRate) => exchangeRate.date)),
          yAxis: this.processYAxis(exchangeRates),
        }
      }),
    ).subscribe();
  }

  processSeries(data: number[] = []): echarts.SeriesOption[] {
    return [
      {
        name: 'Exchange Rate',
        type: 'line',
        stack: 'Total',
        data,
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        },
        markLine: {
          data: [{ type: 'average', name: 'Avg' }]
        }
      }
    ]
  }

  processXAxis(data: string[] = []): echarts.XAXisComponentOption | echarts.XAXisComponentOption[] {
    return {
      type: 'category',
      boundaryGap: false,
      data: data.map((date: string) => (new Date(date)).toLocaleTimeString()),
    }
  }

  processYAxis(data: ExchangeRate[] = []): echarts.YAXisComponentOption | echarts.YAXisComponentOption[] {
    return {
      type: 'value',
      min: (Math.min(...data.map((exchangeRate: ExchangeRate) => exchangeRate.rate)) - 0.2).toFixed(2),
      max: (Math.max(...data.map((exchangeRate: ExchangeRate) => exchangeRate.rate)) + 0.2).toFixed(2),
    }
  }

  processTitle(exchangeRate?: ExchangeRate): echarts.TitleComponentOption | echarts.TitleComponentOption[] {
    return {
      text: 'Real-time Exchange Rate',
      ...(exchangeRate && {subtext: `${exchangeRate.target} exchange rate for 1${exchangeRate.source} at ${(new Date(exchangeRate.date).toDateString())}`}),
    }
  }
}
