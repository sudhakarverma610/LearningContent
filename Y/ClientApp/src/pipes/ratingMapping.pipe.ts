import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingMapping'
})
export class RatingMappingPipe implements PipeTransform {
  transform(value: number, args?: any): boolean[] {     
      let items=[false,false,false,false,false];
      for(let i=0;i<value;i++){
        items[i]=true;
      }
      return items; 
  }
}
