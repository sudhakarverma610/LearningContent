import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'firstwordonly', pure: true })
export class FirstWordOnly implements PipeTransform {
  transform(value: string, args: any[] = []) {
    return value ? value.substr(0, value.indexOf(' ')) : '';
  }
}
