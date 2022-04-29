import { Pipe, PipeTransform } from '@angular/core';
import { Product } from 'src/store/products/products.model';

@Pipe({
  name: 'SpiltProducts'
})
export class SpiltProductsPipe implements PipeTransform {

  transform(products: Product[], size: number): any {
   const arrayOfArrays = [];
   let counter = 0;
    // apply filter for curator product only
   const productsConfigu =  products.filter(product => {
     const result = product.tags.find(
      tag =>
        tag === 'base' ||
        tag === 'bead' ||
        tag === 'hanging'
    )
      ? true
      : false;
     const ishidetag = product.tags.find(tag => tag === 'hide') ? true : false;
     return result && !ishidetag;
    });
   for (let i = 0; i < productsConfigu.length; i += size) {
        arrayOfArrays.push({id: counter, products: productsConfigu.slice(i, i + size)});
        counter++;
    }
   return arrayOfArrays;
  }

}
