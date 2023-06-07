import { Component } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, map, tap, timer } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss'],
    standalone: true,
    imports: [LetDirective, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
})
export class PageNotFoundComponent {
    private readonly count = 15;

    redirectionCountdown$: Observable<number> = timer(0, 1000).pipe(
        map((count: number) => this.count - count),
        tap((countDown: number) => {
            if (countDown <= 0) {
                this.redirect();
            }
        }),
    );

    constructor(public router: Router) {}

    redirect(): void {
        this.router.navigate(['converter']);
    }
}
