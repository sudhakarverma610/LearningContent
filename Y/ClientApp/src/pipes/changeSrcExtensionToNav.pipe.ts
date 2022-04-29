import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'changeSrcExtensionToNav'
})
export class ChangeSrcExtensionToNavPipe implements PipeTransform {

  transform(value: string): any {
    const currentName = value.substr(0, value.lastIndexOf('.'));
    return currentName + '_nav.png';
  }
}
