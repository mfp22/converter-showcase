import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'noData'
})
export class NoDataPipe implements PipeTransform {
    transform<T>(value: T): T|string {
        return value || 'N/D';
    }
}
