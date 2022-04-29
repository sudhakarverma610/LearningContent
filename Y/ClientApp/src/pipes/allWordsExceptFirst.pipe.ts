import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'allwordsexceptfirst', pure: true })
export class AllWordsExceptFirst implements PipeTransform {
  transform(value: string, args: any[] = []) {
    value.trim();
    return value ? value.substr(value.indexOf(' '), value.length) : '';
  }
}
