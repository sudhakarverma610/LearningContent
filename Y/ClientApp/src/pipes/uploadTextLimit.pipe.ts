import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uploadTextLimit'
})
export class UploadTextLimitPipe implements PipeTransform {

  transform(text: string): string {
    let value=(text.slice(0,15)+'...'+text.slice(35,40))+'.'+text.split('.').pop();
    return value;
  }

}
