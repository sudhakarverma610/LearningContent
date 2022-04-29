import { Pipe, PipeTransform } from '@angular/core';
import { Image, Product } from 'src/store/products/products.model';

@Pipe({
  name: 'ConfiguratorImage'
})
export class ConfiguratorImagePipe implements PipeTransform {

  transform(product: Product): Image {
   const constimage = product.images.filter(x =>   (x.title === 'ConfigurationImage' && x.alt === 'ConfigurationImage'));
   return constimage ? constimage[0] : product.images[0];
  }

}
