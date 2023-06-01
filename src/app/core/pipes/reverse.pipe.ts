import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {
  transform<T>(value: T[]): T[] {
    if (value instanceof Array) return Array.from(value).reverse();
    else throw new Error(`ReversePipe: unsupported type of ${typeof value}`);
  }
}
