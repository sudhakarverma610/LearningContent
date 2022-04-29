import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToArray'
})
export class NumberToArrayPipe implements PipeTransform {

  transform(value: number): number[] {
    const array = [];
    for (let index = 1; index <= value; index++) {
      array.push(index);
    }
    return array;
  }

}
