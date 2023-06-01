import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'noData'
})
export class NoDataPipe implements PipeTransform {
    transform<T>(value: any): any {
        return value || 'N/D';
    }
}
