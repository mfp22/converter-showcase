import { NgModule } from '@angular/core';
import {
    NoDataPipe,
    ReversePipe,
} from '.';

@NgModule({
    declarations: [
        NoDataPipe,
        ReversePipe,
    ],
    exports: [
        NoDataPipe,
        ReversePipe,
    ],
})
export class PipesModule {}
