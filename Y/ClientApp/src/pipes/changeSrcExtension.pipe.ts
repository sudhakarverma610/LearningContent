import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'changeSrcExtension', pure: true })
export class ChangeSrcExtension implements PipeTransform {
  transform(value: string, type: string, returnSameIfGif: number = 2) {
    const currentExt = value.substr(value.lastIndexOf('.'));
    const newExt = type.substr(type.lastIndexOf('.'));
    if (currentExt === '.svg') {
      return value;
    }
    if (currentExt === '.jpeg' && newExt === '.png') {
      return value;
    }
    return value ? value.substr(0, value.lastIndexOf('.')) + type : '';
  }
}
