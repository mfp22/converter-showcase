import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
    selector: '[appGrid]',
    standalone: true,
})
export class GridDirective implements OnChanges {
    @Input() gap = 'none';
    @Input() templateColumns = 'none';
    @Input() templateRow = 'none';

    constructor(private el: ElementRef) {
        this.el.nativeElement.style.display = 'grid';
    }

    ngOnChanges(): void {
        this.el.nativeElement.style['grid-column-gap'] = this.gap;
        this.el.nativeElement.style['grid-row-gap'] = this.gap;
        this.el.nativeElement.style['grid-template-columns'] = this.templateColumns;
        this.el.nativeElement.style['grid-template-rows'] = this.templateRow;
    }
}
