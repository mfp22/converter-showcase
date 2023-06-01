import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
    ],
    declarations: [FooterComponent],
    exports: [FooterComponent]
})
export class FooterModule {}
