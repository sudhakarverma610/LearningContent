import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'splitArrayOneToMany'
})
export class SplitArrayOneToMany implements PipeTransform {
    transform(items: any[], filter: number): any {
        const result = [];
        for (let i = 0; i < items.length; i += filter) {
          result.push(items.slice(i, i + filter));
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return result;
    }
}