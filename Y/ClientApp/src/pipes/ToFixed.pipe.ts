import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ToFixed'
})
export class ToFixedPipe implements PipeTransform {

  transform(value: number, decimalFixed?: number): any {
    if (!value) {
      return value;
    }
    if (decimalFixed) {
      return value.toFixed(decimalFixed);
    }
    return value.toFixed(0);
  }

}
