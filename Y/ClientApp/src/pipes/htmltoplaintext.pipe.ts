import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'htmlToPlaintext', pure: true })
export class HtmlToPlaintextPipe implements PipeTransform {
  transform(value: string, args: any[] = []) {
    return value ? String(value).replace(/<[^>]+>/gm, '') : '';
  }
}
