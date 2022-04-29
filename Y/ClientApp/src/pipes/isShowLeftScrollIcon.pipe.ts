import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isShowLeftRigthScrollPipe'
})
export class IsShowLeftRightScrollPipeIcon implements PipeTransform {

  transform(elmnt: HTMLElement, isLeft: boolean, argument?: boolean): boolean {
    if (!elmnt) {
      return false;
    }
    const maxScrollLeft = elmnt.scrollWidth - elmnt.clientWidth;
    if (maxScrollLeft === 0) {
        return false;
      }
    const returnvalue = isLeft ? (elmnt.scrollLeft === 0 ? false : true) :
                                (elmnt.scrollLeft === maxScrollLeft ? false : true);
    return returnvalue;
  }
}
