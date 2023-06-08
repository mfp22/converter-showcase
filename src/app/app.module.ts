import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ExchangeRateMockInterceptor } from './exchange-rate/exchange-rate-mock.interceptor';

@NgModule({
    declarations: [AppComponent],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FooterComponent,
        HeaderComponent,
        HttpClientModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts'),
        }),
        ScrollingModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ExchangeRateMockInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
