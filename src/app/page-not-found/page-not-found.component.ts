import { Component } from '@angular/core';
import { LetModule } from '@ngrx/component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, map, tap, timer } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss'],
    standalone: true,
    imports: [
        MatButtonModule,
        MatProgressSpinnerModule,
        LetModule,
    ],
})
export class PageNotFoundComponent {
    private readonly count = 5;

    redirectionCountdown$: Observable<number> = timer(0, 1000).pipe(
        map((count: number) => this.count - count),
        tap((countDown: number) => {if (countDown <= 0) {this.redirect()}}),
    );

    constructor(public router: Router) {}

    redirect(): void {
        this.router.navigate(['converter']);
    }
}
