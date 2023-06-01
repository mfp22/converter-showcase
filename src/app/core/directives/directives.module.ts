import { NgModule } from '@angular/core';
import { GridDirective, ScrollDirective } from '.';

@NgModule({
    declarations: [
        GridDirective,
        ScrollDirective,
    ],
    exports: [
        GridDirective,
        ScrollDirective,
    ]
})
export class DirectivesModule {}
