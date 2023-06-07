import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'noData',
    standalone: true,
})
export class NoDataPipe implements PipeTransform {
    transform<T>(value: T): T | string {
        return value || 'N/D';
    }
}
