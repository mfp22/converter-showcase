import { Component, OnDestroy } from '@angular/core';
import { Subject, Observable, takeUntil } from 'rxjs';

@Component({
    template: '',
})
export class SubscriptionSupervisorComponent implements OnDestroy {
    private isAlive$ = new Subject<boolean>();

    protected unsubsribeOnDestroy = <T>(source: Observable<T>): Observable<T> => source.pipe(takeUntil(this.isAlive$));

    public ngOnDestroy() {
        this.isAlive$.next(false);
        this.isAlive$.complete();
    }
}
